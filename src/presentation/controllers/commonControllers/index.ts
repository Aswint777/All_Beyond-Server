import { IDependencies } from "../../../application/interfaces/IDependencies";
import { resentOtpController, verifyOtpController } from "./otpController";
import {
  getFirstUserDetailsController,
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
  };
};
