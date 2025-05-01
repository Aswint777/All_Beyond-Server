import { IDependencies } from "../../../application/interfaces/IDependencies";
import { EnrolmentController } from "./enrolmentController";
import { StudentOverviewController } from "./overviewController";
import { ProgressController } from "./progressController";

export const studentController = (dependencies: IDependencies) => {
  const enrolment = new EnrolmentController(dependencies);
  const progress = new ProgressController(dependencies);
  const overview = new StudentOverviewController(dependencies)

  return {
    enrollCourse: enrolment.enrollCourse.bind(enrolment),
    coursePayment: enrolment.coursePayment.bind(enrolment),
    studentCourses: enrolment.studentCourses.bind(enrolment),
    watchCourse: enrolment.watchCourse.bind(enrolment),
    // streamVideo:enrolment.streamVideo.bind(enrolment),
    alreadyEnrolledCourses: enrolment.alreadyEnrolledCourses.bind(enrolment),
    initializeProgress: progress.initializeProgress.bind(progress),
    getProgress: progress.getProgress.bind(progress),
    updateProgress: progress.updateProgress.bind(progress),

    studentDashboard:overview.studentDashboard.bind(overview),
    addReview:overview.addReview.bind(overview),
    getReviews:overview.getReviews.bind(overview),

  };
};
