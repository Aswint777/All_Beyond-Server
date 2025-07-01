import { IDependencies } from "../../../application/interfaces/IDependencies";
import { CourseController } from "./courseController";
import { OtpController } from "./otpController";
import { ProfileController } from "./profileController";
import { UserController } from "./UserController";

export const controller = (dependencies: IDependencies) => {
  const userController = new UserController(dependencies);
  const otpController = new OtpController(dependencies);
  const profileController = new ProfileController(dependencies);
  const courseController = new CourseController(dependencies);

  return {
    signUp: userController.signUp.bind(userController),
    login: userController.login.bind(userController),
    logOut: userController.logout.bind(userController),
    google_Auth: userController.googleAuth.bind(userController),
    userDetails: userController.getUserDetails.bind(userController),

    otpVerification: otpController.otpVerification.bind(otpController),
    resendOtp: otpController.resendOtp.bind(otpController),
    forgot_Password: otpController.forgot_Password.bind(otpController),
    forgotOtpVerification:
      otpController.forgotOtpVerification.bind(otpController),
    resetPassword: otpController.resetPassword.bind(otpController),

    editProfile: profileController.editProfile.bind(profileController),
    uploadProfilePhoto:
      profileController.uploadProfilePhoto.bind(profileController),
    switchUserRole: profileController.switchUserRole.bind(profileController),

    allCourses: courseController.allCourses.bind(courseController),
    courseDetails:
      courseController.courseDetailsController.bind(courseController),
    similarCourse:
      courseController.similarCourseController.bind(courseController),
    allCategory: courseController.allCategory.bind(courseController),
    latestCourses: courseController.latestCourses.bind(courseController),
  };
};
