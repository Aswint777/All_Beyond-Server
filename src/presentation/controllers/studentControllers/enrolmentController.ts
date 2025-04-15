import { Request, Response } from "express";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";
import Stripe from "stripe";
import { constant } from "../../../_lib/common/constant";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { getSignedUrlForS3thumbnails } from "../../../_boot/getSignedUrl";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "your-stripe-secret-key", {
  apiVersion: "2025-03-31.basil", // Latest version as of April 2025
});

export class EnrolmentController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // student course payment controller
  async coursePayment(req: Request, res: Response): Promise<void> {
    const {coursePaymentUseCase} = this.dependencies.useCases
    try {
      const user = getUserFromToken(req, res);
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const userId = user._id;

      const { courseId, price } = req.body;

      if (!courseId) {
        res.status(httpStatusCode.BAD_REQUEST).json({ success: false, message: "Course ID is required" });
        return;
      }

      if (typeof price !== "number" || price <= 0) {
        res.status(httpStatusCode.BAD_REQUEST).json({ success: false, message: "Valid price is required" });
        return;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: (price || 0) * 100, // Convert to cents
        currency: "inr",
        payment_method_types: ["card"],
        metadata: { userId, courseId },
      });

      console.log("PaymentIntent created:", paymentIntent.id);
      console.log("ClientSecret:", paymentIntent.client_secret);

      const data = {
        courseId:courseId,
        userId:userId,
        amount:price
      }

      const payment = await coursePaymentUseCase(this.dependencies).execute(data)

      res.status(httpStatusCode.OK).json({
        success: true,
        clientSecret: paymentIntent.client_secret, // Fixed: Return clientSecret, not STRIPE_SECRET_KEY
      });
    } catch (error) {
      console.error("Error in coursePayment:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
   // controller for enroll course 
  async enrollCourse(req: Request, res: Response): Promise<void> {
    const {  enrolCourseUseCases } = this.dependencies.useCases;
    try {
      console.log("Data in the enroll controller:", req.body);

      const user = getUserFromToken(req, res);
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const userId = user._id;
      const { courseId } = req.body;

      if (!courseId) {
        res.status(httpStatusCode.BAD_REQUEST).json({ success: false, message: "Course ID is required" });
        return;
      }
      const data = {
        courseId:courseId,
        userId:userId,
      }
      // Enroll user (for both free and verified premium courses)
      const course = await enrolCourseUseCases(this.dependencies).execute(data);
      res.status(httpStatusCode.OK).json({
        data : course,
        success: true,
        message: `Successfully enrolled in course`,
      });
    } catch (error) {
      console.error("Error in enrollCourse:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  // listing the student enrolled courses in student side 
  async studentCourses(req: Request, res: Response): Promise<void> {
    const { studentCoursesUseCase } = this.dependencies.useCases;
    try {
      console.log("Listing the student's enrolled courses...");
      const user = getUserFromToken(req, res);
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const userId = user._id;
  
      const { search = "", page = "1", limit = "6" } = req.query;
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 6;
      const skip = (pageNum - 1) * limitNum;
  
      const safeSearch = typeof search === "string" ? search : "";
  
      console.log("Query params:", { userId, search: safeSearch, skip, limitNum });
  
      const result = await studentCoursesUseCase(this.dependencies).execute(
        userId,
        safeSearch,
        skip,
        limitNum
      );
      console.log("result :",result);
      
  
      if (!result || result.courses.length === 0) {
        res.status(200).json({
          success: true,
          message: "No enrolled courses found",
          data: { courses: [], totalPages: 0, currentPage: pageNum, totalCourses: 0 },
        });
        return;
      }
  
      const { courses, totalCourses } = result;
  
      const coursesWithSignedUrls = await Promise.all(
        courses.map(async (course: CourseEntity) => {
          if (course.thumbnailUrl) {
            const fileKey = course.thumbnailUrl.split("/course_assets/thumbnails/")[1];
            course.thumbnailUrl = await getSignedUrlForS3thumbnails(fileKey);
          }
          return course;
        })
      );
  
      const totalPages = Math.ceil(totalCourses / limitNum);
  
      res.status(200).json({
        success: true,
        message: "Enrolled courses listed successfully",
        data: {
          courses: coursesWithSignedUrls,
          totalPages,
          currentPage: pageNum,
          totalCourses,
        },
      });
    } catch (error: any) {
      console.error("Error in studentCourses:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}