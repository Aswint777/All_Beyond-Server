import { constant } from "../../../_lib/common/constant";
import { assessmentCourses, AssessmentResponse } from "../../../domain/entities/assessmentEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class ExamUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async studentAssessmentsUseCase(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<AssessmentResponse| null> {
    const { studentAssessmentsRepository } = this.dependencies.repositories;
    try {

      const allCourses = await studentAssessmentsRepository(
        userId,
        page,
        limit,
        search
      );
      if (!allCourses) {
        console.log("No courses found for userId:", userId, "search:", search);
        return null;
      }
      return allCourses;
    } catch (error: constant) {
      console.error("Error in assessmentCoursesUseCase:", error);
      throw new Error(
        "An unexpected error occurred: " + (error.message || "Unknown error")
      );
    }
  }
}
