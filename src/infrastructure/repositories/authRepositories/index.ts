import { IDependencies } from "../../../application/interfaces/IDependencies";
import { createUserEntity, UserEntity } from "../../../domain/entities/User";
import {
  matchOtpEntity,
  resetOne,
  verifyOtpEntity,
} from "../../../domain/entities/verifyOtpEntity";
import { CourseRepository } from "./courseRepository";
import { OtpRepository } from "./otpRepository";
import { ProfileRepository } from "./profileRepository";
import { UserRepository } from "./userRepository";

export const AuthRepositories = (dependencies: IDependencies) => {
  const UserRepositoryInstance = new UserRepository(dependencies);
  const OtpRepositoryInstance = new OtpRepository(dependencies);
  const profileRepositoryInstance = new ProfileRepository(dependencies);
  const courseRepositoryInstance = new CourseRepository(dependencies);

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
    userOnline: (email: string) => UserRepositoryInstance.userOnline(email),

    //OtpRepository
    verifyOtp: (otpData: verifyOtpEntity) =>
      OtpRepositoryInstance.verifyOtp(otpData),
    otpMatchChecking: (data: matchOtpEntity) =>
      OtpRepositoryInstance.otpMatchChecking(data),
    verifyOtpTrue: (email: string) =>
      OtpRepositoryInstance.verifyOtpTrue(email),
        resetPasswordRepo: (Data: resetOne) =>
      OtpRepositoryInstance.resetPasswordRepo(Data),

    // Profile Repository
    profileEdit: (data: UserEntity) =>
      profileRepositoryInstance.profileEdit(data),
    uploadPhoto: (userId: string, profilePhoto: string) =>
      profileRepositoryInstance.uploadPhoto(userId, profilePhoto),
    switchRole: (id: string) => profileRepositoryInstance.switchRole(id),

    // course repository

    allCoursesRepo: (
      page: number,
      limit: number,
      search?: string,
      category?: string,
      sort?: string,
      pricingOption?: string
    ) =>
      courseRepositoryInstance.allCoursesRepo(
        page,
        limit,
        search,
        category,
        sort,
        pricingOption
      ),
    getCoursesCountRepo: (search:string, category:string, pricingOption:string) => courseRepositoryInstance.getCoursesCountRepo(search, category, pricingOption),

    courseDetailsRepo: (courseId: string) =>
      courseRepositoryInstance.courseDetailsRepo(courseId),
    similarCourseRepo: (courseId: string) =>
      courseRepositoryInstance.similarCourseRepo(courseId),
    latestCoursesRepo: () => courseRepositoryInstance.latestCoursesRepo(),
  };
};
