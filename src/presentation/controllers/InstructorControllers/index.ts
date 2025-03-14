import { IDependencies } from "../../../application/interfaces/IDependencies";
import { CourseController } from "./courseController";
import { ApplyInstructorController } from "./instructorApplicationController";
// import { InstructorController } from "./instructorApplicationController";

export const instructorController = (dependencies: IDependencies) => {
  const instructorApply = new ApplyInstructorController(dependencies);
  const courseController = new CourseController(dependencies)
  return {
    instructorApplication:instructorApply.instructorApplication.bind(instructorApply),
    createCourse: courseController.createCourse.bind(courseController)

  };
};
