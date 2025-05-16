import { AssessmentEntity, QuestionEntity } from "../../../domain/entities/assessmentEntity";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";
import { InstructorApplyUseCase } from "./applyInstructorUseCase";
import { AssessmentUseCase } from "./assessmentUseCase";
import { CourseUseCase } from "./courseUseCase";

export const instructorUseCase = (dependencies: IDependencies) => {
  const instructorApplyUseCase = new InstructorApplyUseCase(dependencies);
  const courseUseCase = new CourseUseCase(dependencies);
  const assessmentUseCase = new AssessmentUseCase(dependencies);
  return {
    applyInstructorUseCase: () => ({
      execute: (courseData: UserEntity) =>
        instructorApplyUseCase.applyInstructorUseCase(courseData),
    }),
    createCourseUseCase: () => ({
      execute: (data: CourseEntity, id: string) =>
        courseUseCase.createCourseUseCase(data, id),
    }),
    allCategoriesUseCase: () => ({
      execute: () => courseUseCase.allCategoriesUseCase(),
    }),
    listInstructorCourseUseCase: () => ({
      execute: (
        id: string,
        search: string = "",
        skip: number = 0,
        limit: number = 6
      ) => courseUseCase.listInstructorCourseUseCase(id, search, skip, limit),
    }),
    editCourseUseCase: () => ({
      execute: (courseData: CourseEntity) =>
        courseUseCase.editCourseUseCase(courseData),
    }),
    blockCourseUseCase: () => ({
      execute: (courseId: string) => courseUseCase.blockCourseUseCase(courseId),
    }),
    instructorDashboardUseCase: () => ({
      execute: (userId: string) =>
        instructorApplyUseCase.instructorDashboardUseCase(userId),
    }),
    assessmentCoursesUseCase: () => ({
      execute: (userId: string, page: number, limit: number, search: string) =>
        assessmentUseCase.assessmentCoursesUseCase(userId, page, limit, search),
    }),
    createAssessmentsUseCase: () => ({
      execute: (data: AssessmentEntity) =>
        assessmentUseCase.createAssessmentsUseCase(data),
    }),

    getAssessmentUseCase: () => ({
      execute: (assessmentId: string) =>
        assessmentUseCase.getAssessmentUseCase(assessmentId),
    }),
    
    updateAssessmentUseCase: () => ({
      execute: (assessmentId: string,data:QuestionEntity[]) =>
        assessmentUseCase.updateAssessmentUseCase(assessmentId,data),
    }),
  };
};
