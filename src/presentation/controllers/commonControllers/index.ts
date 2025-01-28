import { IDependencies } from "../../../application/interfaces/IDependencies";
import { getFirstUserDetailsController } from "./getFirstUserDetailsController";
import { loginController } from "./loginContrioller";
import { logOutController } from "./logOutController";
import { verifyOtpController } from "./otpController";
import { resentOtpController } from "./resentOtpController";
import { signUpController } from "./signUpController";

export const controller = (dependencies: IDependencies) => {
  return {
    signUp: signUpController(dependencies),
    // login: loging
    otpVerify: verifyOtpController(dependencies),
    login: loginController(dependencies),
    logOut: logOutController(dependencies),
    resend: resentOtpController(dependencies),
    userDetails:getFirstUserDetailsController(dependencies)
  };
};
