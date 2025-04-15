import { TransactionOutput } from "../../entities/paymentEntity";
import { UserEntity } from "../../entities/User";

export interface IBlock_UnBlockUserUseCase {
  execute(userId: string, isBlocked: boolean): Promise<boolean | null>;
}

export interface IGetStudentsListUseCase {
  execute(): Promise<UserEntity[] | boolean | null>;
}

export interface IUserDetailsUseCase {
  execute(userId: string): Promise<UserEntity | null>;
}

export interface ITransactionHistoryUseCase {
  execute(
    skip: number,
    limit: number
  ): Promise<{ transactions: TransactionOutput[]; totalTransactions: number } | null>;
}
