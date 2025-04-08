import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { EnrolmentEntity } from "../../../domain/entities/enrolmentEntity";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";
import { Enrolment } from "../../database/model/enrolmentModel";
import { Payment } from "../../database/model/paymentModel";

export class EnrolmentRepository
  implements Pick<IRepositories, "coursePaymentRepository">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // apply for instructor
  async coursePaymentRepository(
    data: PaymentEntity
  ): Promise<PaymentEntity | null> {
    try {
      return await Payment.create(data);
    } catch (error: constant) {
      throw new Error("An unexpected error occurred");
    }
  }

  async enrolCourseRepository(
    data: EnrolmentEntity
  ): Promise<EnrolmentEntity | null> {
    try {
      return await Enrolment.create(data);
    } catch (error: constant) {
      throw new Error("An unexpected error occurred");
    }
  }
}
