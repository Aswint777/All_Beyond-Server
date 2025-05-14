import { constant } from "../../../_lib/common/constant";
import { assessmentCourses, AssessmentEntity } from "../../../domain/entities/assessmentEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class AssessmentUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async assessmentCoursesUseCase(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ courses: assessmentCourses[]; totalPages: number } | null> {
    const { assessmentCoursesRepository } = this.dependencies.repositories;
    try {
      const allCourses = await assessmentCoursesRepository(userId, page, limit, search);
      if (!allCourses) {
        console.log("No courses found for userId:", userId, "search:", search);
        return null;
      }
      return allCourses;
    } catch (error: constant) {
      console.error("Error in assessmentCoursesUseCase:", error);
      throw new Error("An unexpected error occurred: " + (error.message || "Unknown error"));
    }
  }

   async createAssessmentsUseCase(data:AssessmentEntity): Promise<AssessmentEntity | null> {
    const { createAssessmentsRepository } = this.dependencies.repositories;
    try {
      const allCourses = await createAssessmentsRepository(data);
      if (!allCourses) {
        return null;
      }
      return allCourses;
    } catch (error: constant) {
      console.error("Error in create assessment:", error);
      throw new Error("An unexpected error occurred: " + (error.message || "Unknown error"));
    }
  }
}