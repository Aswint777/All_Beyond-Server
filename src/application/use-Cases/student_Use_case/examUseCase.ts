import { constant } from "../../../_lib/common/constant";
import { Answers, assessmentCourses, AssessmentEntity, AssessmentResponse, CertificateDetails, ExamAssessment } from "../../../domain/entities/assessmentEntity";
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

   async getQuestionsUseCase(assessmentId:string): Promise<ExamAssessment| null> {
    const { getQuestionsRepository } = this.dependencies.repositories;
    try {
      const allCourses = await getQuestionsRepository(assessmentId);
      if (!allCourses) {
        return null;
      }
      return allCourses;
    } catch (error: constant) {
      console.error("Error in getQuestionsUseCase:", error);
      throw new Error(
        "An unexpected error occurred: " + (error.message || "Unknown error")
      );
    }
  }

  async submitAssessmentUseCase(assessmentId: string,userId:string,    answers:{answers: Answers[]}
  ): Promise<ExamAssessment| null> {
    const { submitAssessmentRepository } = this.dependencies.repositories;
    try {
      const allCourses = await submitAssessmentRepository(assessmentId,userId,answers);
      if (!allCourses) {
        return null;
      }
      return allCourses;
    } catch (error: constant) {
      console.error("Error in getQuestionsUseCase:", error);
      throw new Error(
        "An unexpected error occurred: " + (error.message || "Unknown error")
      );
    }
  }

   async certificateUseCase(assessmentId: string,userId:string): Promise<CertificateDetails| null> {
    const { certificateRepository } = this.dependencies.repositories;
    try {
      const allCourses = await certificateRepository(assessmentId,userId);
      if (!allCourses) {
        return null;
      }
      return allCourses;
    } catch (error: constant) {
      console.error("Error in certificateUseCase:", error);
      throw new Error(
        "An unexpected error occurred: " + (error.message || "Unknown error")
      );
    }
  }
}
