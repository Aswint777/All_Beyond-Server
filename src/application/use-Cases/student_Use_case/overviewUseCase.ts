import { DashboardData, StudentDashboardData } from "../../../domain/entities/enrolmentEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class StudentOverviewUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async studentDashboardUseCase(userId: string): Promise<StudentDashboardData | null> {
    const { studentDashboardRepository } = this.dependencies.repositories
    try {
        const dashboardData = await studentDashboardRepository(userId);
        console.log("Use case dashboard data:", dashboardData);
        return dashboardData;
      
    } catch (error) {
      console.error("Error in studentDashboardUseCase:", error);
      return null;
    }
  }
}
