import { IDependencies } from "../../../application/interfaces/IDependencies";
import { resentOtpController, verifyOtpController } from "./otpController";
import { profileEditController, uploadProfilePhotoController } from "./profileController";
import {
  getFirstUserDetailsController,
  google_AuthController,
  loginController,
  logOutController,
  signUpController,
} from "./UserController";

export const controller = (dependencies: IDependencies) => {
  return {
    signUp: signUpController(dependencies),
    otpVerify: verifyOtpController(dependencies),
    login: loginController(dependencies),
    logOut: logOutController(dependencies),
    resend: resentOtpController(dependencies),
    userDetails: getFirstUserDetailsController(dependencies),
    google_Auth:google_AuthController(dependencies),
    profile: profileEditController(dependencies),
    uploadProfilePhoto: uploadProfilePhotoController(dependencies)
  };
};
