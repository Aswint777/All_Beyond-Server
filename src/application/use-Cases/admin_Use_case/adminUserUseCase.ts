import { constant } from "../../../_lib/common/constant";
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
}
