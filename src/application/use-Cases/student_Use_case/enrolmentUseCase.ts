import { constant } from "../../../_lib/common/constant";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import {
  CourseOutput,
  EnrolmentEntity,
} from "../../../domain/entities/enrolmentEntity";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class EnrolmentUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // student course payment useCase
  async coursePaymentUseCase(
    data: PaymentEntity
  ): Promise<PaymentEntity | null> {
    const { coursePaymentRepository } = this.dependencies.repositories;
    try {
      const total = data.amount;
      if (total) {
        const instructorShare = (total * 70) / 100;
        const adminShare = (total * 30) / 100;
        data.instructorShare = instructorShare;
        data.adminShare = adminShare;
      }
      const payment = await coursePaymentRepository(data);
      if (!payment) {
        return null;
      }
      return payment;
    } catch (error: constant) {
      throw new Error("An unexpected error is occurred");
    }
  }

  // enroll course useCase

  async enrolCourseUseCases(
    data: EnrolmentEntity
  ): Promise<EnrolmentEntity | null> {
    const { enrolCourseRepository } = this.dependencies.repositories;
    try {
      // console.log(
      //   data,
      //   "lllllllllllllllllllllllllllllllllllllllllllllllll repo "
      // );

      const course = await enrolCourseRepository(data);
      if (!course) return null;
      // console.log(
      //   "data is here kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
      // );

      return course;
    } catch (error: constant) {
      throw new Error("An unexpected error is occurred");
    }
  }

  // listing the student enrolled courses
  async studentCoursesUseCase(
    userId: string,
    safeSearch: string,
    skip: number,
    limitNum: number
  ): Promise<{ courses: CourseEntity[]; totalCourses: number } | null> {
    const { studentCoursesRepository } = this.dependencies.repositories;
    try {
      const result = await studentCoursesRepository(
        userId,
        safeSearch,
        skip,
        limitNum
      );
      if (!result || result.courses.length === 0) return null;
      return result;
    } catch (error: any) {
      console.error("Error in studentCoursesUseCase:", error);
      throw new Error("An unexpected error occurred");
    }
  }

  async watchCourseUseCase(
    courseId: string,
    userId: string
  ): Promise<CourseOutput | null> {
    const { watchCourseRepository } = this.dependencies.repositories;
    try {
      const result = await watchCourseRepository(courseId, userId);
      if (!result) {
        throw new Error("Course not found");
      }

      return result;
    } catch (error: any) {
      console.error("Error in courseDetailsUseCase:", error);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async alreadyEnrolledUseCase(
    courseId: string,
    userId: string
  ): Promise<boolean | null> {
    const { alreadyEnrolledRepository } = this.dependencies.repositories;
    try {
      return await alreadyEnrolledRepository(courseId, userId);
    } catch (error: any) {
      console.error("Error in alreadyEnrolledUseCase:", error);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}
