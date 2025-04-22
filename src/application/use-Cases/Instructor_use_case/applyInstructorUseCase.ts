import { constant } from "../../../_lib/common/constant";
import { InstructorDashboardData } from "../../../domain/entities/enrolmentEntity";
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

  async instructorDashboardUseCase(
    userId: string
  ): Promise<InstructorDashboardData | null> {
    const { instructorDashboardRepository } = this.dependencies.repositories;
    try {
      const result = await instructorDashboardRepository(userId);
      return result;
    } catch (error: any) {
      console.error("Error in dashboardUseCase:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}
