// export * from "./applyInstructor"

import { IDependencies } from "../../../application/interfaces/IDependencies";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { UserEntity } from "../../../domain/entities/User";
import { ApplyInstructor } from "./applyInstructor";
import { CourseRepository } from "./courseRepository";

export const InstructorRepositories = (dependencies: IDependencies) => {
  const applyInstructorInstance = new ApplyInstructor(dependencies);
  const courseRepository = new CourseRepository(dependencies)
  return {
    instructorApplication: (data: UserEntity) =>
      applyInstructorInstance.instructorApplication(data),
    createCourseRepository :(courseData:CourseEntity,id:string)=>courseRepository.createCourseRepository(courseData,id),
    getAllCategoryRepository:()=>courseRepository.getAllCategoryRepository(),
    listInstructorRepository:(
      id: string,
      search: string = "",
      skip: number = 0,
      limit: number = 6
    )=>courseRepository.listInstructorRepository(id,search,skip,limit),
    editCourseRepository:(courseData: CourseEntity)=>courseRepository.editCourseRepository(courseData),
    blockCourseRepository:(courseId: string)=>courseRepository.blockCourseRepository(courseId),
    instructorDashboardRepository:(userId:string)=>applyInstructorInstance.instructorDashboardRepository(userId)
  };
};
