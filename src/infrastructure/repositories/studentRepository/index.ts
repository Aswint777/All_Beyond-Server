import { IDependencies } from "../../../application/interfaces/IDependencies";
import { EnrolmentEntity } from "../../../domain/entities/enrolmentEntity";
import { ReviewData } from "../../../domain/entities/overviewEntity";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";
import { EnrolmentRepository } from "./enrolmentRepository";
import { OverViewRepository } from "./overviewRepository";
import { ProgressRepository } from "./progressRepository";

export const studentRepositories = (dependencies: IDependencies) => {
  const enrolmentRepository = new EnrolmentRepository(dependencies);
  const progressRepository = new ProgressRepository(dependencies);
  const overViewRepository = new OverViewRepository(dependencies);
  return {
    coursePaymentRepository: (data: PaymentEntity) =>
      enrolmentRepository.coursePaymentRepository(data),
    enrolCourseRepository: (data: EnrolmentEntity) =>
      enrolmentRepository.enrolCourseRepository(data),

    studentCoursesRepository: (
      userId: string,
      safeSearch: string,
      skip: number,
      limitNum: number
    ) =>
      enrolmentRepository.studentCoursesRepository(
        userId,
        safeSearch,
        skip,
        limitNum
      ),
    watchCourseRepository: (courseId: string, userId: string) =>
      enrolmentRepository.watchCourseRepository(courseId, userId),

    alreadyEnrolledRepository: (courseId: string, userId: string) =>
      enrolmentRepository.alreadyEnrolledRepository(courseId, userId),
    initializeProgressRepository: (courseId: string, userId: string) =>
      progressRepository.initializeProgressRepository(courseId, userId),
    getProgressRepository: (courseId: string, userId: string) =>
      progressRepository.getProgressRepository(courseId, userId),
    updateProgressRepository: (
      courseId: string,
      userId: string,
      lessonId: string
    ) =>
      progressRepository.updateProgressRepository(courseId, userId, lessonId),
      studentDashboardRepository:(userId:string)=>overViewRepository.studentDashboardRepository(userId),
      addReviewRepository:(data:ReviewData)=>overViewRepository.addReviewRepository(data),

      getReviewRepository:(courseId:string)=>overViewRepository.getReviewRepository(courseId),
      averageReviewRepository:(courseId:string)=>overViewRepository.averageReviewRepository(courseId),

  };
};
