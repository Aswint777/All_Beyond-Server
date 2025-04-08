import { Request, Response } from "express";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "your-stripe-secret-key", {
  apiVersion: "2025-03-31.basil", // Latest version as of April 2025
});

export class EnrolmentController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

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
}