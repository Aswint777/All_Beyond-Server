import { IDependencies } from "../../../application/interfaces/IDependencies";
import { createUserEntity, UserEntity } from "../../../domain/entities/User";
import {
  matchOtpEntity,
  verifyOtpEntity,
} from "../../../domain/entities/verifyOtpEntity";
import { OtpRepository } from "./otpRepository";
import { ProfileRepository } from "./profileRepository";
import { UserRepository } from "./userRepository";

export const AuthRepositories = (dependencies: IDependencies) => {
  const UserRepositoryInstance = new UserRepository(dependencies);
  const OtpRepositoryInstance = new OtpRepository(dependencies);
  const profileRepositoryInstance = new ProfileRepository(dependencies);

  return {
    //UserRepository
    checkByName: (name: string) => UserRepositoryInstance.checkByName(name),
    checkByEmail: (email: string) => UserRepositoryInstance.checkByEmail(email),
    checkNotBlocked: (email: string) =>
      UserRepositoryInstance.checkNotBlocked(email),
    createUser: (data: createUserEntity) =>
      UserRepositoryInstance.createUser(data),
    getUserDetails: (_id: string) => UserRepositoryInstance.getUserDetails(_id),
    googleAuth: (email: string, username: string) =>
      UserRepositoryInstance.googleAuth(email, username),

    //OtpRepository
    verifyOtp: (otpData: verifyOtpEntity) =>
      OtpRepositoryInstance.verifyOtp(otpData),
    otpMatchChecking: (data: matchOtpEntity) =>
      OtpRepositoryInstance.otpMatchChecking(data),
    verifyOtpTrue: (email: string) =>
      OtpRepositoryInstance.verifyOtpTrue(email),

    // Profile Repository
    profileEdit: (data: UserEntity) =>
      profileRepositoryInstance.profileEdit(data),
    uploadPhoto: (userId: string, profilePhoto: string) =>
      profileRepositoryInstance.uploadPhoto(userId, profilePhoto),
  };
};
