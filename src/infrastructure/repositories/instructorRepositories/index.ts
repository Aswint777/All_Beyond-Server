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
    createCourseRepository :(courseData:CourseEntity)=>courseRepository.createCourseRepository(courseData),
    getAllCategoryRepository:()=>courseRepository.getAllCategoryRepository(),
  };
};
