import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { UserEntity } from "../../../domain/entities/User";
import { User } from "../../database/model";

export class AdminInstructorRepository
  implements
    Pick<IRepositories, "getInstructorApplication" | "updateInstructorStatus">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // listing the applied candidates for instructors
  async getInstructorApplication(): Promise<UserEntity[] | boolean | null> {
    try {
      console.log("console on the check by email repository");

      const studentsList = await User.find({
        isVerified: true,
        isAppliedInstructor: true,
      });
      console.log(studentsList, " result form getStudentsList repo");
      if (studentsList) {
        return studentsList;
      }
      return false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }

  // updating status for instructor applicants
  async updateInstructorStatus(
    Id: string,
    status: string
  ): Promise<UserEntity | null> {
    try {
      console.log("api call is here ");
      console.log(status, Id);

      const update = await User.findOneAndUpdate(
        { _id: Id },
        { $set: { status: status ,  role: status === "approved" ? "instructor" : "student" } }, { new: true } 
      );
      if (!update) {
        return null;
      }
      return update;
    } catch (error: constant) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }
}
