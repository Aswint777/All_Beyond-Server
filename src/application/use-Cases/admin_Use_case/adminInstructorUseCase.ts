import { constant } from "../../../_lib/common/constant";
import { notification } from "../../../_lib/common/emailDesign";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
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
      return userList;
    } catch (error: constant) {
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "Error in checking with get user",
      };
    }
  }

  // updating the status of instructor application list
  async updateInstructorStatusUseCase(
    Id: string,
    status: string
  ): Promise<UserEntity | null> {
    const { updateInstructorStatus } = this.dependencies.repositories;
    try {
      const update = await updateInstructorStatus(Id, status);
      if (!update) {
        return null;
      }
      if (update.status === "approved" && update.email && update.username) {
        await notification(update.username, update.email, "approved");
      }
      if (update.status === "rejected" && update.username && update.email) {
        await notification(update.username, update.email, "rejected");
      }
      return update;
    } catch (error: constant) {
    throw {
      status: httpStatusCode.INTERNAL_SERVER_ERROR,
      message: error?.message || "Error in checking with update user",
    };
    }
  }
}
