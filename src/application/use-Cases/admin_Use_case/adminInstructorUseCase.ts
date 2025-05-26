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

  // listing the Instructor application in the admin side
  async getInstructorApplicationUseCase(page:number, limit:number):  Promise<{ data: UserEntity[], total: number, currentPage: number, totalPages: number }| boolean | null> {
    try {
      const { getInstructorApplication } = this.dependencies.repositories;
      const userList = await getInstructorApplication(page,limit);
      return userList;
    } catch (error: constant) {
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "Error in checking with get user",
      };
    }
  }

    // listing the Instructor in the admin side
  async getInstructorUseCase(page:number, limit:number):  Promise<{ data: UserEntity[], total: number, currentPage: number, totalPages: number }| boolean | null> {
    try {
      const { getInstructorsRepo } = this.dependencies.repositories;
      const userList = await getInstructorsRepo(page,limit);
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
