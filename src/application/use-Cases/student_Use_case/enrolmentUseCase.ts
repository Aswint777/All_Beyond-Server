import { constant } from "../../../_lib/common/constant";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { EnrolmentEntity } from "../../../domain/entities/enrolmentEntity";
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
      console.log("payment UseCase");
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
      console.log(
        data,
        "lllllllllllllllllllllllllllllllllllllllllllllllll repo "
      );

      const course = await enrolCourseRepository(data);
      if (!course) return null;
      console.log(
        "data is here kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
      );

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
      const result = await studentCoursesRepository(userId, safeSearch, skip, limitNum);
      if (!result || result.courses.length === 0) return null;      
      return result;
    } catch (error: any) {
      console.error("Error in studentCoursesUseCase:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}
