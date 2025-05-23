import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { DashboardData } from "../../../domain/entities/enrolmentEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class OverviewUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // Get for Admin Dashboard
  async dashboardUseCase(): Promise<DashboardData | null> {
    const { dashboardRepository } = this.dependencies.repositories;
    try {
      const result = await dashboardRepository();
      return result;
    } catch (error: any) {
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "Error in user Details use case",
      };
    }
  }
}
