import { IDependencies } from "../../../application/interfaces/IDependencies";
import { OtpController } from "./otpController";
import { ProfileController } from "./profileController";
import { UserController } from "./UserController";

export const controller = (dependencies: IDependencies) => {
  const userController = new UserController(dependencies);
  const otpController = new OtpController(dependencies);
  const profileController = new ProfileController(dependencies);

  return {
    signUp: userController.signUp.bind(userController),
    login: userController.login.bind(userController),
    logOut: userController.logout.bind(userController),
    google_Auth: userController.googleAuth.bind(userController),
    userDetails: userController.getUserDetails.bind(userController),

    otpVerification: otpController.otpVerification.bind(otpController),
    resendOtp: otpController.resendOtp.bind(otpController),

    editProfile: profileController.editProfile.bind(profileController),
    uploadProfilePhoto:
      profileController.uploadProfilePhoto.bind(profileController),
    switchUserRole: profileController.switchUserRole.bind(profileController),
  };
};
