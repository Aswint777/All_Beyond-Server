import { Router } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { studentController } from "../controllers/studentControllers";
import { jwtMiddleware } from "../middlewares/jwtMiddlewares";
import { verifyStudent } from "../middlewares/verifyStudent";
import { verifyUser } from "../middlewares/verifyUser";
import { uploadFiles } from "../../_boot/multerConfig";

const fileUpload = uploadFiles.single('file');

export const studentRoutes = (dependencies: IDependencies) => {
  const {
    enrollCourse,
    coursePayment,
    studentCourses,
    watchCourse,
    alreadyEnrolledCourses,
    initializeProgress,
    getProgress,
    updateProgress,
    studentDashboard,
    addReview,
    getReviews,
    getUserChats,
    getChatMessages,
    sendMessages,
    getLastMessage,
    studentAssessments,
    getQuestions,
    submitAssessment,
    courseCertificate,
    videoChatList,
    getNotifications,
    readAllNotifications,
    studentTransactions,
    sendFileMessages,
  } = studentController(dependencies);

  const router = Router();
  router
    .route("/coursePayment")
    .post(jwtMiddleware, verifyStudent, coursePayment);
  router.route("/enroll").post(jwtMiddleware, verifyStudent, enrollCourse);
  router.route("/courses").get(jwtMiddleware, verifyStudent, studentCourses);
  router
    .route("/WatchCourses/:courseId")
    .get(jwtMiddleware, verifyStudent, watchCourse);
  router
    .route("/alreadyEnrolledCourses/:courseId")
    .get(jwtMiddleware, alreadyEnrolledCourses);
  router
    .route("/initializeProgress")
    .post(jwtMiddleware, verifyStudent, initializeProgress);
  router
    .route("/progress/:courseId")
    .get(jwtMiddleware, verifyStudent, getProgress);
  router
    .route("/updateProgress/:courseId")
    .post(jwtMiddleware, verifyStudent, updateProgress);

  router
    .route("/dashboard")
    .get(jwtMiddleware, verifyStudent, studentDashboard);

  router
    .route("/addReviews/:courseId")
    .post(jwtMiddleware, verifyStudent, addReview);
  router.route("/reviews/:courseId").get(getReviews);
  // router.get("/stream/:videoKey", streamVideo);

  router.route("/chatList").get(jwtMiddleware, verifyUser, getUserChats);
  router
    .route("/messages/:chatId")
    .get(jwtMiddleware, verifyUser, getChatMessages);
  router
    .route("/messages/:chatId")
    .post(jwtMiddleware, verifyUser, sendMessages);

      router
    .route("/fileMessages/:chatId")
    .post(jwtMiddleware, verifyUser,fileUpload, sendFileMessages);

  router
    .route("/lastMessage/:chatId")
    .get(jwtMiddleware, verifyUser, getLastMessage);
  router.route("/videoChatList").get(jwtMiddleware, verifyUser, videoChatList);
  router
    .route("/studentAssessments")
    .get(jwtMiddleware, verifyUser, studentAssessments);

  router
    .route("/getQuestions/:assessmentId")
    .get(jwtMiddleware, verifyUser, getQuestions);

  router
    .route("/submit-assessment/:assessmentId")
    .post(jwtMiddleware, verifyUser, submitAssessment); 

  router
    .route("/Download_Certificate/:assessmentId")
    .get(jwtMiddleware, verifyUser, courseCertificate);

  router.route("/notifications").get(getNotifications);
    router.route("/notifications-read-all").put(readAllNotifications);

  router.route("/transactions").get(studentTransactions);

  return router;
};
