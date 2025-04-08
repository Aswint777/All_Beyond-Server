import { constant } from "../../../_lib/common/constant";
import { EnrolmentEntity } from "../../../domain/entities/enrolmentEntity";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class EnrolmentUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // Create Course UseCase
  async coursePaymentUseCase(
    data: PaymentEntity,
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

  async enrolCourseUseCases(data:EnrolmentEntity):Promise<EnrolmentEntity|null>{
    const{enrolCourseRepository} = this.dependencies.repositories
    try {
      console.log(data ,"lllllllllllllllllllllllllllllllllllllllllllllllll repo ");
      
      const course = await enrolCourseRepository(data)
      if(!course) return null
      console.log('data is here kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
      
      return course
    } catch (error:constant) {
      throw new Error("An unexpected error is occurred");
    }
  }
}
