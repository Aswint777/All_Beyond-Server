import { IDependencies } from "../../../application/interfaces/IDependencies";
import { CourseController } from "./courseController";
import { ApplyInstructorController } from "./instructorApplicationController";
// import { InstructorController } from "./instructorApplicationController";

export const instructorController = (dependencies: IDependencies) => {
  const instructorApply = new ApplyInstructorController(dependencies);
  const courseController = new CourseController(dependencies)
  return {
    instructorApplication:instructorApply.instructorApplication.bind(instructorApply),
    createCourse: courseController.createCourse.bind(courseController),
    getCourseCategories:courseController.getCourseCategories.bind(courseController),
    listInstructorCourse:courseController.listInstructorCourse.bind(courseController),
    viewCourses:courseController.viewCourses.bind(courseController),
    editCourse : courseController.editCourse.bind(courseController),
    blockCourse: courseController.blockCourse.bind(courseController)

  };
};
