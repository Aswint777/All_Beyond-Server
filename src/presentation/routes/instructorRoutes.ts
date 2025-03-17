import { Router } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { instructorController } from "../controllers/InstructorControllers";
import { jwtMiddleware } from "../middlewares/jwtMiddlewares";
import { uploadCloudinary, uploadS3 } from "../../_boot/multerConfig";

const cpUpload = uploadCloudinary.fields([
  { name: "profilePhoto", maxCount: 1 }, // Single file for profile photo
  { name: "educationFile", maxCount: 1 }, // Single file for education document
]);

export const instructorRoutes = (dependencies: IDependencies) => {
  const { instructorApplication, createCourse, getCourseCategories } =
    instructorController(dependencies);

  const router = Router();

  // Handle file uploads with multer.fields() for multiple files
  router
    .route("/instructorApplication/:_id")
    .post(cpUpload, instructorApplication);

  router.route("/createCourse").post(uploadS3.any(), createCourse);

  router.route("/courseCategories").get(getCourseCategories);

  //  router.route("/createCourse").post(courseUpload,createCourse)
  return router;
};
