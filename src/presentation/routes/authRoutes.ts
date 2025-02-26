import { Router } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { controller } from "../controllers/commonControllers";
import { jwtMiddleware } from "../middlewares/jwtMiddlewares";
import { verifyUser } from "../middlewares/verifyUser";
import upload from "../../_boot/multerConfig";

// ✅ Ensure we accept dependencies as a parameter instead of importing it directly.
export const routers = (dependencies: IDependencies) => {
  const {
    signUp,
    otpVerification,
    resendOtp,
    login,
    logOut,
    userDetails,
    google_Auth,
    editProfile,
    uploadProfilePhoto,
  } = controller(dependencies);

  const router = Router();

  // ✅ User Authentication Routes
  router.route("/signup").post(signUp);
  router.route("/OtpVerify").post(otpVerification);
  router.route("/login").post(login);
  router.route("/logOut").delete(logOut);
  router.route("/resent").post(resendOtp);

  // // ✅ User Profile Routes
  router.route("/userDetails").get(userDetails);
  router.route("/google-auth").post(google_Auth);

  router.route("/updateProfile").put(editProfile);

  // // ✅ File Upload Route
  const cpUpload = upload.fields([{ name: "profilePhoto", maxCount: 1 }]);
  router.route("/uploadProfilePhoto").put(cpUpload, uploadProfilePhoto);

  return router;
};
