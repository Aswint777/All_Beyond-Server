import { constant } from "../../../_lib/common/constant";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";

export class InstructorApplyUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // application for instructor
  async applyInstructorUseCase(data: UserEntity): Promise<boolean | null> {
    try {
      const { instructorApplication } = this.dependencies.repositories;

      return await instructorApplication(data);
    } catch (error: constant) {
      console.log("Error in apply ");

      throw new Error(error?.message || "Error in otp apply instructor");
    }
  }
}
