import { CourseEntity } from "../../../domain/entities/courseEntity";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";
import { InstructorApplyUseCase } from "./applyInstructorUseCase";
import { CourseUseCase } from "./courseUseCase";

export const instructorUseCase = (dependencies: IDependencies) => {
  const instructorApplyUseCase = new InstructorApplyUseCase(dependencies);
  const courseUseCase = new CourseUseCase(dependencies)
  return {
    applyInstructorUseCase: () => ({
      execute: (courseData: UserEntity) =>
        instructorApplyUseCase.applyInstructorUseCase(courseData),
    }),
    createCourseUseCase:()=>({
      execute:(data:CourseEntity)=>courseUseCase.createCourseUseCase(data)
    }),
    allCategoriesUseCase:()=>({
      execute:()=>courseUseCase.allCategoriesUseCase()
    }),
  };
};
