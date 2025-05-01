import { constant } from "../../../_lib/common/constant";
import { DashboardData, StudentDashboardData } from "../../../domain/entities/enrolmentEntity";
import { AverageReview, ReviewData } from "../../../domain/entities/overviewEntity";
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
      
    } catch (error:constant) {
      console.error("Error in studentDashboardUseCase:", error);
      throw new Error(error.message || "An unexpected error occurred");    }
  }

    async addReviewUseCase(data: ReviewData): Promise<ReviewData | null> {
      try {
        const{addReviewRepository} = this.dependencies.repositories
        return await addReviewRepository(data)
      } catch (error:constant) {
        throw new Error(error.message || "An unexpected error occurred");
      }
}

async getReviewUseCase(courseId:string): Promise<ReviewData[] | null> {
  try {
    const{getReviewRepository} = this.dependencies.repositories
    return await getReviewRepository(courseId)
  } catch (error:constant) {
    throw new Error(error.message || "An unexpected error occurred");
  }
}

async averageReviewUseCase(courseId:string): Promise<AverageReview | null> {
  try {
    const{averageReviewRepository} = this.dependencies.repositories
    return await averageReviewRepository(courseId)
  } catch (error:constant) {
    throw new Error(error.message || "An unexpected error occurred");
  }
}
}