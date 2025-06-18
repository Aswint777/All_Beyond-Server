import { Router } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { instructorController } from "../controllers/InstructorControllers";
import { jwtMiddleware } from "../middlewares/jwtMiddlewares";
import { uploadCloudinary, uploadS3 } from "../../_boot/multerConfig";

const cpUpload = uploadCloudinary.fields([
  { name: "profilePhoto", maxCount: 1 }, 
  { name: "educationFile", maxCount: 1 }, 
]);

export const instructorRoutes = (dependencies: IDependencies) => {
  const {
    instructorApplication,
    createCourse,
    getCourseCategories,
    listInstructorCourse,
    viewCourses,
    editCourse,
    blockCourse,
    instructorDashboard,
    assessmentCourses,
    createAssessments,
    getAssessment,
    updateAssessment,
    instructorTransactions,
  } = instructorController(dependencies);

  const router = Router();

  // Handle file uploads with multer.fields() for multiple files
  router
    .route("/instructorApplication/:_id")
    .post(cpUpload, instructorApplication);

  router
    .route("/createCourse")
    .post(jwtMiddleware, uploadS3.any(), createCourse);

  router.route("/courseCategories").get(getCourseCategories);

  router.route("/courses").get(jwtMiddleware, listInstructorCourse);

  router.route("/viewCourses/:courseId").get(jwtMiddleware, viewCourses);

  router
    .route("/editCourse/:courseId")
    .put(jwtMiddleware, uploadS3.any(), editCourse);

  router.route("/blockCourse/:courseId").put(jwtMiddleware, blockCourse);

  router.route("/overview").get(jwtMiddleware, instructorDashboard);
    router.route("/transactions").get(jwtMiddleware, instructorTransactions);


  router
    .route("/courses-with-assessments")
    .get(jwtMiddleware, assessmentCourses);
  router.route("/createAssessments").post(jwtMiddleware, createAssessments);

    router.route("/getAssessment/:assessmentId").get(jwtMiddleware, getAssessment);

    router.route("/updateAssessment/:assessmentId").put(jwtMiddleware, updateAssessment);

  return router;
};
