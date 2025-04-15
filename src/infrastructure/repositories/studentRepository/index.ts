import { IDependencies } from "../../../application/interfaces/IDependencies";
import { EnrolmentEntity } from "../../../domain/entities/enrolmentEntity";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";
import { EnrolmentRepository } from "./enrolmentRepository";

export const studentRepositories = (dependencies: IDependencies) => {
  const enrolmentRepository = new EnrolmentRepository(dependencies);
  return {
    coursePaymentRepository: (data: PaymentEntity) =>
      enrolmentRepository.coursePaymentRepository(data),
    enrolCourseRepository: (data: EnrolmentEntity) =>
      enrolmentRepository.enrolCourseRepository(data),

    studentCoursesRepository:(userId:string,safeSearch:string,skip:number,limitNum:number)=> enrolmentRepository.studentCoursesRepository(userId,safeSearch,skip,limitNum)
  };
};
