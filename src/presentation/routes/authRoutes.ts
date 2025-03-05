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
  router.route("/login").post(login);
  router.route("/logOut").delete(logOut);
  router.route("/google-auth").post(google_Auth);

  // otp routes
  router.route("/OtpVerify").post(otpVerification);
  router.route("/resent").post(resendOtp);

  router.route("/userDetails").get(jwtMiddleware,userDetails);   

  // // ✅ User Profile Routes
  router.route("/updateProfile").put(jwtMiddleware,verifyUser,editProfile);

  // // ✅ File Upload Route
  const cpUpload = upload.fields([{ name: "profilePhoto", maxCount: 1 }]);
  router.route("/uploadProfilePhoto").put(jwtMiddleware,cpUpload, uploadProfilePhoto);

  return router;
};
