import { IDependencies } from "../../../application/interfaces/IDependencies";
import { AssessmentController } from "./assessmentController";
import { CourseController } from "./courseController";
import { ApplyInstructorController } from "./instructorApplicationController";
import { InstructorOverviewController } from "./overviewController";

export const instructorController = (dependencies: IDependencies) => {
  const instructorApply = new ApplyInstructorController(dependencies);
  const courseController = new CourseController(dependencies);
  const overview = new InstructorOverviewController(dependencies);
  const assessment = new AssessmentController(dependencies);
  return {
    instructorApplication:
      instructorApply.instructorApplication.bind(instructorApply),
    createCourse: courseController.createCourse.bind(courseController),
    getCourseCategories:
      courseController.getCourseCategories.bind(courseController),
    listInstructorCourse:
      courseController.listInstructorCourse.bind(courseController),
    viewCourses: courseController.viewCourses.bind(courseController),
    editCourse: courseController.editCourse.bind(courseController),
    blockCourse: courseController.blockCourse.bind(courseController),
    instructorDashboard: overview.instructorDashboard.bind(overview),
    assessmentCourses: assessment.assessmentCourses.bind(assessment),
    createAssessments: assessment.createAssessments.bind(assessment),
    getAssessment: assessment.getAssessment.bind(assessment),
        updateAssessment: assessment.updateAssessment.bind(assessment),

  };
};
