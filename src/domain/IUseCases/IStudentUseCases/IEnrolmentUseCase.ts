import { CourseEntity } from "../../entities/courseEntity";
import { CourseOutput, EnrolmentEntity } from "../../entities/enrolmentEntity";
import { PaymentEntity } from "../../entities/paymentEntity";
import { ProgressEntity } from "../../entities/progressEntity";

export interface ICoursePaymentUseCase {
  execute(data: PaymentEntity): Promise<PaymentEntity | null>;
}

export interface IEnrolCourseUseCases {
  execute(data: EnrolmentEntity): Promise<EnrolmentEntity | null>;
}

export interface IStudentCoursesUseCase {
  execute(
    userId: string,
    safeSearch: string,
    skip: number,
    limitNum: number
  ): Promise<{ courses: CourseEntity[]; totalCourses: number } | null>;
}

export interface IWatchCourseUseCase {
  execute(courseId: string, userId: string): Promise<CourseOutput | null>;
}

export interface IAlreadyEnrolledUseCase {
  execute(courseId: string, userId: string): Promise<boolean | null>;
}

export interface IInitializeProgressUseCase {
  execute(courseId: string, userId: string): Promise<ProgressEntity | null>;
}
export interface IGetProgressUseCase {
  execute(courseId: string, userId: string): Promise<ProgressEntity | null>;
}
export interface IUpdateProgressUseCase {
  execute(
    courseId: string,
    userId: string,
    lessonId: string
  ): Promise<ProgressEntity | null>;
}
