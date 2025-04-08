import { EnrolmentEntity } from "../../entities/enrolmentEntity";
import { PaymentEntity } from "../../entities/paymentEntity";

export interface ICoursePaymentUseCase {   
    execute (data:PaymentEntity):Promise<PaymentEntity |null>
}

export interface IEnrolCourseUseCases {   
    execute (data:EnrolmentEntity):Promise< EnrolmentEntity|null>
}

