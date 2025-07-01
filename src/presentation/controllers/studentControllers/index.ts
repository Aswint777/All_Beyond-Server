import { IDependencies } from "../../../application/interfaces/IDependencies";
import { ChatController } from "./chatController";
import { EnrolmentController } from "./enrolmentController";
import { ExamController } from "./examController";
import { StudentOverviewController } from "./overviewController";
import { ProgressController } from "./progressController";

export const studentController = (dependencies: IDependencies) => {
  const enrolment = new EnrolmentController(dependencies);
  const progress = new ProgressController(dependencies);
  const overview = new StudentOverviewController(dependencies);
  const chat = new ChatController(dependencies);
  const exam = new ExamController(dependencies);

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

    studentDashboard: overview.studentDashboard.bind(overview),
    addReview: overview.addReview.bind(overview),
    getReviews: overview.getReviews.bind(overview),
    getNotifications: overview.getNotifications.bind(overview),
    studentTransactions: overview.studentTransactions.bind(overview),

    getUserChats: chat.getUserChats.bind(chat),
    getChatMessages: chat.getChatMessages.bind(chat),
    sendMessages: chat.sendMessages.bind(chat),
    getLastMessage: chat.getLastMessage.bind(chat),
    videoChatList: chat.videoChatList.bind(chat),
        sendFileMessages: chat.sendFileMessages.bind(chat),


    studentAssessments: exam.studentAssessments.bind(exam),
    getQuestions: exam.getQuestions.bind(exam),
    submitAssessment: exam.submitAssessment.bind(exam),
    courseCertificate: exam.courseCertificate.bind(exam),
  };
};
