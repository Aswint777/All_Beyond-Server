import { createUserEntity, UserEntity } from "../../../domain/entities/User";
import { matchOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { IDependencies } from "../../interfaces/IDependencies";
import { OtpUseCase } from "./otpUseCase";
import { ProfileUseCase } from "./profileUseCase";
import { UserUseCase } from "./userUseCase";

export const authUseCases = (dependencies: IDependencies) => {
  const userUseCaseInstance = new UserUseCase(dependencies);
  const otpUseCaseInstance = new OtpUseCase(dependencies);
  const profileUseCaseInstance = new ProfileUseCase(dependencies);

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
      execute: (email: string, password: string) =>
        userUseCaseInstance.loginUseCase(email, password),
    }),
    getUserDetailsUseCase: () => ({
      execute: (_id: string) => userUseCaseInstance.getUserDetailsUseCase(_id),
    }),
    googleAuthUseCase: () => ({
      execute: (email: string) => userUseCaseInstance.googleAuthUseCase(email),
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

    // Profile useCase
    profileEditUseCase: () => ({
      execute: (data: UserEntity) =>
        profileUseCaseInstance.profileEditUseCase(data),
    }),
    changePasswordUseCase: () => ({
      execute: (
        email: string,
        currentPassword: string,
        newPassword: string,
        confirmPassword: string
      ) =>
        profileUseCaseInstance.changePasswordUseCase(
          email,
          currentPassword,
          newPassword,
          confirmPassword
        ),
    }),
    uploadPhotoUseCase: () => ({
      execute: (userId: string, profilePhoto: string) =>
        profileUseCaseInstance.uploadPhotoUseCase(userId, profilePhoto),
    }),
  };
};
