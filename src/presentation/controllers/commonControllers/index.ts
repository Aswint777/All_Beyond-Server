

import { IDependencies } from "../../../application/interfaces/IDependencies";
import { OtpController } from "./otpController";
// import { OtpController } from "./otpController";
// import { ProfileController } from "./profileController";
import { UserController } from "./UserController";

// // export const controller = (dependencies: IDependencies) => {
// //   return {
// //     signUp: signUpController(dependencies),
// //     otpVerify: verifyOtpController(dependencies),
// //     login: loginController(dependencies),
// //     logOut: logOutController(dependencies),
// //     resend: resentOtpController(dependencies),
// //     userDetails: getFirstUserDetailsController(dependencies),
// //     google_Auth:google_AuthController(dependencies),
// //     profile: profileEditController(dependencies),
// //     uploadProfilePhoto: uploadProfilePhotoController(dependencies)
// //   };
// // };


// controllers/commonControllers.ts


export const controller = (dependencies: IDependencies) => {
  const userController = new UserController(dependencies);
  const otpController = new OtpController(dependencies);
  // const profileController = new ProfileController(dependencies);

  return {
    signUp: userController.signUp.bind(userController),
    login: userController.login.bind(userController),
    logOut: userController.logout.bind(userController), 
    google_Auth: userController.googleAuth.bind(userController),

    otpVerification:otpController.otpVerification.bind(otpController),
    resendOtp: otpController.resendOtp.bind(otpController),

    userDetails: userController.getUserDetails.bind(userController),
    // profile: profileController.editProfile.bind(profileController),
    // uploadProfilePhoto: profileController.uploadProfilePhoto.bind(profileController),
  };
};
