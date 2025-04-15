import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { TransactionOutput } from "../../../domain/entities/paymentEntity";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";

export class AdminUserUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // listing the students in the admin side
  async getStudentsListUseCase(): Promise<UserEntity[] | boolean | null> {
    try {
      const { getStudentsList } = this.dependencies.repositories;
      const userList = await getStudentsList();
      console.log(userList);
      return userList;
    } catch (error: constant) {
      console.log("Error in checking with get user");

      throw new Error(error?.message || "Error in checking with get user");
    }
  }
 
  // blocking the users
  async blockUnblockUserUseCase(
    userId: string,
    isBlocked: boolean
  ): Promise<boolean | null> {
    const { block_UnBlockUser } = this.dependencies.repositories;
    try {
      const result = await block_UnBlockUser(userId, isBlocked);
      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error: constant) {
      console.log("Error in block and unblock");

      throw new Error(error?.message || "Error in block and unblock");
    }
  }

  // user Details 
  async userDetailsUseCase(userId:string): Promise<UserEntity| null>{
    const {findByUserId} = this.dependencies.repositories
    try {
      const details = await findByUserId(userId)
      
      if(!details){
        return null
      }
      return details

    } catch (error:constant) {
      throw new Error(error?.message || "Error in user Details use case");

    }
  }
  async transactionHistoryUseCase(
    skip: number,
    limit: number
  ): Promise<{ transactions: TransactionOutput[]; totalTransactions: number } | null> {
    const { transactionHistoryRepository } = this.dependencies.repositories;
    try {
      const result = await transactionHistoryRepository(skip, limit);
      if (!result || result.transactions.length === 0) {
        return null;
      }
      console.log(result,"📌 Step 1 complete");
      
      return result;
    } catch (error: any) {
      console.error("Error in transactionHistoryUseCase:", error);
      throw new Error("An unexpected error occurred");
    }
  }

}
