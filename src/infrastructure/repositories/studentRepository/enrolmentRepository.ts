import mongoose from "mongoose";
import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { EnrolmentEntity } from "../../../domain/entities/enrolmentEntity";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";
import { Enrolment } from "../../database/model/enrolmentModel";
import { Payment } from "../../database/model/paymentModel";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { Course } from "../../database/model";

export class EnrolmentRepository
  implements Pick<IRepositories, "coursePaymentRepository"|"enrolCourseRepository" | "studentCoursesRepository">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // repository for payment for enrolling course
  async coursePaymentRepository(
    data: PaymentEntity
  ): Promise<PaymentEntity | null> {
    try {
      return await Payment.create(data);
    } catch (error: constant) {
      throw new Error("An unexpected error occurred");
    }
  }
  
  // enrolling course
  async enrolCourseRepository(
    data: EnrolmentEntity
  ): Promise<EnrolmentEntity | null> {
    try {
      return await Enrolment.create(data);
    } catch (error: constant) {
      throw new Error("An unexpected error occurred");
    }
  }
  
  // repository  for listing the student enrolled courses

  async studentCoursesRepository(
    userId: string,
    search: string = "",
    skip: number = 0,
    limit: number = 6
  ): Promise<{ courses: CourseEntity[]; totalCourses: number } | null> {
    try {
      // Step 1: Query Enrolment collection to get course IDs for the user
      const enrolmentQuery = {
        userId: new mongoose.Types.ObjectId(userId),
      };
  
      console.log("Enrolment query:", enrolmentQuery);
  
      // Fetch enrolments with pagination
      const enrolments = await Enrolment.find(enrolmentQuery)
        .select("courseId") // Only select courseId to optimize
        .skip(skip)
        .limit(limit)
        .lean();
  
      if (!enrolments.length) {
        console.log("No enrolments found for user:", userId);
        return { courses: [], totalCourses: 0 };
      }
  
      // Extract course IDs
      const courseIds = enrolments.map((enrolment) => enrolment.courseId);
  
      console.log("Enrolled course IDs:", courseIds);
  
      // Step 2: Query Course collection using course IDs
      const courseQuery = {
        _id: { $in: courseIds },
        isBlocked: false, // Only fetch unblocked courses
        ...(search && { courseTitle: { $regex: search, $options: "i" } }), // Case-insensitive search
      };
  
      console.log("Course query:", courseQuery);
  
      // Fetch courses and total count
      const [courses, totalCourses] = await Promise.all([
        Course.find(courseQuery)
          .populate("user", "name") // Populate instructor name
          .populate("categoryName", "categoryName") // Optional: Populate category
          .lean() as Promise<CourseEntity[]>,
        Enrolment.countDocuments(enrolmentQuery), // Total enrolments for pagination
      ]);
  
      console.log("Repository result:", { courses, totalCourses });
  
      return { courses, totalCourses };
    } catch (error: any) {
      console.error("Error in studentCoursesRepository:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}
