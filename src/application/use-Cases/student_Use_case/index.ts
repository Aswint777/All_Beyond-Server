import { EnrolmentEntity } from "../../../domain/entities/enrolmentEntity";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";
import { IDependencies } from "../../interfaces/IDependencies";
import { EnrolmentUseCase } from "./enrolmentUseCase";

export const studentUseCase = (dependencies: IDependencies) => {
  const enrolmentUseCase = new EnrolmentUseCase(dependencies);
  return {
    coursePaymentUseCase: () => ({
      execute: (data: PaymentEntity) =>
        enrolmentUseCase.coursePaymentUseCase(data),
    }),
    enrolCourseUseCases:()=>({
      execute:(data:EnrolmentEntity)=>enrolmentUseCase.enrolCourseUseCases(data)
    }),
    studentCoursesUseCase:()=>({
      execute:(userId:string,safeSearch:string,skip:number,limitNum:number)=>enrolmentUseCase.studentCoursesUseCase(userId,safeSearch,skip,limitNum)
    })
  };
};
