import { constant } from "../../../_lib/common/constant";
import { notification } from "../../../_lib/common/emailDesign";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";

export class AdminInstructorUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // listing the students in the admin side
  async getInstructorApplicationUseCase(): Promise<
    UserEntity[] | boolean | null
  > {
    try {
      const { getInstructorApplication } = this.dependencies.repositories;
      const userList = await getInstructorApplication();
      console.log(userList);
      return userList;
    } catch (error: constant) {
      console.log("Error in checking with get user");

      throw new Error(error?.message || "Error in checking with get user");
    }
  }

  // updating the status of instructor application list
  async updateInstructorStatusUseCase(
    Id: string,
    status: string
  ): Promise<UserEntity | null> {
    const { updateInstructorStatus } = this.dependencies.repositories;
    try {
      console.log(Id, "......");

      const update = await updateInstructorStatus(Id, status);
      if (!update) {
        return null;
      }
      if(update.status === "approved" && update.email&& update.username ){
         console.log('approved');
         await notification(update.username,update.email,'approved');
        }
      if(update.status === "rejected" && update.username &&update.email){
        console.log('rejected');
        await notification(update.username,update.email,'rejected');

      }
      console.log(update,"kskskskskksskskkkssk");
      
      return update;
    } catch (error: constant) {
      console.error("Error updating instructor status:", error);
      return null;
    }
  }
}
