import { DashboardData } from "../../../domain/entities/enrolmentEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class OverviewUseCase {
    private dependencies: IDependencies;
  
    constructor(dependencies: IDependencies) {
      this.dependencies = dependencies;
    }
    async dashboardUseCase(): Promise<DashboardData|null> {
        const { dashboardRepository } = this.dependencies.repositories;
        try {
          const result = await dashboardRepository();
          return result;
        } catch (error: any) {
          console.error("Error in dashboardUseCase:", error);
          throw new Error("An unexpected error occurred");
        }
      }
}  