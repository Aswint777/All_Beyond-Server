import { IDependencies } from "../../application/interfaces/IDependencies";
import { otpVerify } from "../../infrastructure/database/model";
import { verifyOtpController } from "./otpController";
import { signUpController } from "./signUpController";

export const controller =(dependencies:IDependencies) => {
    return {    
        signUp: signUpController(dependencies),
        // login: loging
        otpVerify : verifyOtpController(dependencies)

    }
}