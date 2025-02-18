import { Router } from "express";
// import { login } from "../controllers/authController";
import { dependencies } from "../../_boot/dependency/authDependencies";
import { IDependencies } from "../../application/interfaces/IDependencies";
// import { controller } from "../controllers";
import { otpVerify } from "../../infrastructure/database/model";
import { controller } from "../controllers/commonControllers";
import { jwtMiddleware } from "../middlewares/jwtMiddlewares";
import { verifyUser } from "../middlewares/verifyUser";
import upload from "../../_boot/multerConfig";

const cpUpload = upload.fields([
    { name: "profilePhoto", maxCount: 1 },  // Single file for profile photo
  
  ])

export const routers = (dependencies:IDependencies) => {
    const { signUp,otpVerify,login,logOut,resend,userDetails,google_Auth,profile,uploadProfilePhoto } = controller(dependencies)
    const router = Router()

    router.route("/signup").post(signUp);
    router.route("/OtpVerify").post(otpVerify)
    router.route("/login").post(login)
    router.route("/logOut").delete(logOut)
    router.route('/resent').post(resend)
    router.route('/userDetails').get(jwtMiddleware,userDetails)
    router.route('/google-auth').post(google_Auth)
    router.route("/updateProfile").put(jwtMiddleware,verifyUser,profile)
    router.route("/uploadProfilePhoto").put(cpUpload,uploadProfilePhoto)

    return router;

}

