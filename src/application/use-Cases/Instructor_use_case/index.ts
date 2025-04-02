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
      execute:(data:CourseEntity,id:string)=>courseUseCase.createCourseUseCase(data,id)
    }),
    allCategoriesUseCase:()=>({
      execute:()=>courseUseCase.allCategoriesUseCase()
    }),
    listInstructorCourseUseCase:()=>({
      execute:(
        id: string,
        search: string = "", // Default to empty string
        skip: number = 0,   // Default to 0
        limit: number = 6   // Default to 6
      )=>courseUseCase.listInstructorCourseUseCase(id,search,skip,limit)
    }),
    editCourseUseCase:()=>({
      execute:(courseData:CourseEntity)=>courseUseCase.editCourseUseCase(courseData)
    }),
    blockCourseUseCase:()=>({
      execute:(courseId:string)=>courseUseCase.blockCourseUseCase(courseId)
    })
  };
};
