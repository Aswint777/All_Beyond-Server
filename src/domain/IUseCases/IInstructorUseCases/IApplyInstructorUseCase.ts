import { InstructorDashboardData } from "../../entities/enrolmentEntity";
import { TransactionOutput } from "../../entities/paymentEntity";
import { UserEntity } from "../../entities/User";

export interface IApplyInstructorUseCase {
  execute(data: UserEntity): Promise<boolean | null>;
}

export interface IInstructorDashboardUseCase {
  execute(userId:string):Promise<InstructorDashboardData|null>
}


export interface IInstructorTransactionsUseCase {
  execute(
    userId:string,
    skip: number,
    limit: number
  ): Promise<{ transactions: TransactionOutput[]; totalTransactions: number } | null>;
}