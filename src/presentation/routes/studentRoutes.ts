import { Router } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { studentController } from "../controllers/studentControllers";
import { jwtMiddleware } from "../middlewares/jwtMiddlewares";
import { verifyStudent } from "../middlewares/verifyStudent";

export const studentRoutes = (dependencies: IDependencies) => {
  const { enrollCourse, coursePayment, studentCourses,watchCourse,alreadyEnrolledCourses } =
    studentController(dependencies);

  const router = Router();
  router
    .route("/coursePayment")
    .post(jwtMiddleware, verifyStudent, coursePayment);
  router.route("/enroll").post(jwtMiddleware, verifyStudent, enrollCourse);
  router.route("/courses").get(jwtMiddleware, verifyStudent, studentCourses);
  router.route('/WatchCourses/:courseId').get(jwtMiddleware,verifyStudent,watchCourse)
  router.route('/alreadyEnrolledCourses/:courseId').get(jwtMiddleware,alreadyEnrolledCourses)
  // router.get("/stream/:videoKey", streamVideo);
  return router;
};
