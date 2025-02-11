import { Router } from "express";
import { instructorController } from "../controllers/InstructorControllers";
import upload from "../../_boot/multerConfig"; // Import multer config
import { IDependencies } from "../../application/interfaces/IDependencies";

const cpUpload = upload.fields([
  { name: "profilePhoto", maxCount: 1 },  // Single file for profile photo
  { name: "educationFile", maxCount: 1 },  // Single file for education document

])


export const instructorRoutes = (dependencies: IDependencies) => {
  const { instructorApplication } = instructorController(dependencies);
  const router = Router();

  // Handle file uploads with multer.fields() for multiple files
  router.route("/instructorApplication/:_id").post(cpUpload,instructorApplication)

  return router;
};
