import { createUserEntity } from "../../../domain/entities/User";
import { matchOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { IDependencies } from "../../interfaces/IDependencies";
import { OtpUseCase } from "./otpUseCase";
import { UserUseCase } from "./userUseCase";

export const authUseCases = (dependencies: IDependencies) => {
  const userUseCaseInstance = new UserUseCase(dependencies);
  const otpUseCaseInstance = new OtpUseCase(dependencies);

  return {
    // userUseCaseInstance
    checkByNameUseCase: () => ({
      execute: (name: string) => userUseCaseInstance.checkByNameUseCase(name),
    }),

    checkByEmailUseCase: () => ({
      execute: (email: string) =>
        userUseCaseInstance.checkByEmailUseCase(email),
    }),

    createUserUseCase: () => ({
      execute: (data: createUserEntity) =>
        userUseCaseInstance.createUserUseCase(data),
    }),
    loginUseCase: () => ({
      execute: (email: string,password:string) =>
        userUseCaseInstance.loginUseCase(email,password),
    }),
    getUserDetailsUseCase: () => ({
      execute: (_id: string) =>
        userUseCaseInstance.getUserDetailsUseCase(_id),
    }),
    googleAuthUseCase: () => ({
      execute: (email: string) =>
        userUseCaseInstance.googleAuthUseCase(email),
    }),



    //otpUseCaseInstance
    verifyOtpUseCase: () => ({
      execute: (data: createUserEntity) =>
        otpUseCaseInstance.verifyOtpUseCase(data),
    }),
    otpMatchCheckingUseCase: () => ({
      execute: (data: matchOtpEntity) =>
        otpUseCaseInstance.otpMatchCheckingUseCase(data),
    }),
    verifyOtpTrueUseCase: () => ({
      execute: (email: string) =>
        otpUseCaseInstance.verifyOtpTrueUseCase(email),
    }),
  };
};

// import { IDependencies } from "../../interfaces/IDependencies";
// import { OtpUseCase } from "./otpUseCase";
// import { ProfileUseCase } from "./profileUseCase";
// import { UserUseCase } from "./userUseCase";

// export const authUseCases = (dependencies: IDependencies) => {
//   return {
//     ...new UserUseCase(dependencies),
//     // ...new OtpUseCase(dependencies),
//     // ...new ProfileUseCase(dependencies),
//   };
// };

// import { IDependencies } from "../../../application/interfaces/IDependencies";
// import { UserUseCase } from "../../../application/use-Cases/auth_Use-case/userUseCase";
// import { OtpUseCase } from "../../../application/use-Cases/auth_Use-case/otpUseCase";
// import { ProfileUseCase } from "../../../application/use-Cases/auth_Use-case/profileUseCase";

// export const authUseCases = (dependencies: IDependencies) => {
//   const userUseCaseInstance = new UserUseCase(dependencies);
//   const otpUseCaseInstance = new OtpUseCase(dependencies);
//   const profileUseCaseInstance = new ProfileUseCase(dependencies);

//   return {
//     // ✅ User Use Cases
//     checkByNameUseCase: (name: string) => userUseCaseInstance.checkByNameUseCase(name),
//     checkByEmailUseCase: (email: string) => userUseCaseInstance.checkByEmailUseCase(email),
//     createUserUseCase: (data: any) => userUseCaseInstance.createUserUseCase(data),
//     getUserDetailsUseCase: (id: string) => userUseCaseInstance.getUserDetailsUseCase(id),
//     loginUseCase: (email: string, password: string) => userUseCaseInstance.loginUseCase(email, password),
//     googleAuthUseCase: (email: string) => userUseCaseInstance.googleAuthUseCase(email),

//     // ✅ OTP Use Cases
//     verifyOtpUseCase: (otpData: any) => otpUseCaseInstance.verifyOtp(otpData),
//     verifyOtpTrueUseCase: (email: string) => otpUseCaseInstance.verifyOtpTrue(email),
//     otpMatchCheckingUseCase: (data: any) => otpUseCaseInstance.otpMatchChecking(data),

//     // ✅ Profile Use Cases
//     editProfileUseCase: (data: any) => profileUseCaseInstance.editProfile(data),
//     changePasswordUseCase: (email: string, currentPassword: string, newPassword: string, confirmPassword: string) =>
//       profileUseCaseInstance.changePassword(email, currentPassword, newPassword, confirmPassword),
//     uploadProfilePhotoUseCase: (userId: string, profilePhoto: string) =>
//       profileUseCaseInstance.uploadProfilePhoto(userId, profilePhoto),
//   };
// };

// import { IDependencies } from "../../interfaces/IDependencies";
// import { UserUseCase } from "./userUseCase";
// // import { OtpUseCase } from "./otpUseCase";
// // import { ProfileUseCase } from "./profileUseCase";

// export const authUseCases = (dependencies: IDependencies) => {
//   return {
//     userUseCase: new UserUseCase(dependencies),
//     // otpUseCase: new OtpUseCase(dependencies),
//     // profileUseCase: new ProfileUseCase(dependencies),
//   };
// };

// import exp from "constants"

// export * from "./userUseCase"
// export * from "./otpUseCase"
// export * from "./profileUseCase"

// export {checkByNameUseCase} from "./checkByNameUseCase"
// export {checkByEmailUseCase} from "./checkByEmailUseCase"
// export * from "./createUserUseCase"
// export * from "./verifyOtpUseCase"
// export * from "./otpMatchCheckingUseCase"
// export * from "./verifyOtpTrueUseCase"
// export * from "./loginUseCase"
// export * from "./getUserDetailsUseCase"
