import { EnrolmentEntity } from "../../../domain/entities/enrolmentEntity";
import { ReviewData } from "../../../domain/entities/overviewEntity";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";
import { IDependencies } from "../../interfaces/IDependencies";
import { EnrolmentUseCase } from "./enrolmentUseCase";
import { StudentOverviewUseCase } from "./overviewUseCase";
import { ProgressUseCase } from "./progressUseCase";

export const studentUseCase = (dependencies: IDependencies) => {
  const enrolmentUseCase = new EnrolmentUseCase(dependencies);
  const progressUseCase = new ProgressUseCase(dependencies);
  const studentOverviewUseCase = new StudentOverviewUseCase(dependencies);
  return {
    coursePaymentUseCase: () => ({
      execute: (data: PaymentEntity) =>
        enrolmentUseCase.coursePaymentUseCase(data),
    }),
    enrolCourseUseCases: () => ({
      execute: (data: EnrolmentEntity) =>
        enrolmentUseCase.enrolCourseUseCases(data),
    }),
    studentCoursesUseCase: () => ({
      execute: (
        userId: string,
        safeSearch: string,
        skip: number,
        limitNum: number
      ) =>
        enrolmentUseCase.studentCoursesUseCase(
          userId,
          safeSearch,
          skip,
          limitNum
        ),
    }),
    watchCourseUseCase: () => ({
      execute: (courseId: string, userId: string) =>
        enrolmentUseCase.watchCourseUseCase(courseId, userId),
    }),
    alreadyEnrolledUseCase: () => ({
      execute: (courseId: string, userId: string) =>
        enrolmentUseCase.alreadyEnrolledUseCase(courseId, userId),
    }),
    initializeProgressUseCase: () => ({
      execute: (courseId: string, userId: string) =>
        progressUseCase.initializeProgressUseCase(courseId, userId),
    }),
    getProgressUseCase: () => ({
      execute: (courseId: string, userId: string) =>
        progressUseCase.getProgressUseCase(courseId, userId),
    }),
    updateProgressUseCase: () => ({
      execute: (courseId: string, userId: string, lessonId: string) =>
        progressUseCase.updateProgressUseCase(courseId, userId, lessonId),
    }),

    studentDashboardUseCase:()=>({
      execute:(userId:string)=>studentOverviewUseCase.studentDashboardUseCase(userId)
    }),

    addReviewUseCase:()=>({
      execute:(data:ReviewData)=>studentOverviewUseCase.addReviewUseCase(data)
    }),
    getReviewUseCase:()=>({
      execute:(courseId:string)=>studentOverviewUseCase.getReviewUseCase(courseId)
    }),
    averageReviewUseCase:()=>({
      execute:(courseId:string)=>studentOverviewUseCase.averageReviewUseCase(courseId)
    }),
  };
};
