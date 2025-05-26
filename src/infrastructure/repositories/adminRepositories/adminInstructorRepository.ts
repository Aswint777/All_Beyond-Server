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
  async getInstructorApplication(page:number, limit:number):  Promise<{ data: UserEntity[], total: number, currentPage: number, totalPages: number }| boolean | null> {
    try {
      console.log("console on the check by email repository");
    const query = { isVerified: true,isAppliedInstructor:true,status:'pending' };
    const skip = (page - 1) * limit;

    const total = await User.countDocuments(query);
    const studentsList = await User.find(query)
      .skip(skip)
      .limit(limit)

    if (studentsList.length > 0) {
      return {
        data: studentsList,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    }
    return false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }

    // listing the  instructors
  async getInstructorsRepo(page:number, limit:number):  Promise<{ data: UserEntity[], total: number, currentPage: number, totalPages: number }| boolean | null> {
    try {
      console.log("console on the check by email repository");
    const query = { isVerified: true,role:'instructor' };
    const skip = (page - 1) * limit;

    const total = await User.countDocuments(query);
    const studentsList = await User.find(query)
      .skip(skip)
      .limit(limit)

    if (studentsList.length > 0) {
      return {
        data: studentsList,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
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
