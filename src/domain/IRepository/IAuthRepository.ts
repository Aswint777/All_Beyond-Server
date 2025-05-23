import { createUserEntity, UserEntity } from "../../domain/entities/User";
import { matchOtpEntity, verifyOtpEntity } from "../../domain/entities/verifyOtpEntity";
import { CourseEntity } from "../entities/courseEntity";

export interface IAuthRepository {

  // => Auth Repository

  // user Repository
  checkByName: (name: string) => Promise<boolean | null>;
  checkByEmail: (email: string) => Promise<UserEntity | null>;
  createUser: (data: createUserEntity) => Promise<UserEntity | null>;
  getUserDetails: (_id: string) => Promise<UserEntity | null>;
  googleAuth: (email: string, username: string) => Promise<UserEntity | null>;
  checkNotBlocked: (email: string) => Promise<UserEntity | null>;

  // otp repository
  verifyOtp: (data: verifyOtpEntity) => Promise<verifyOtpEntity | null>;
  otpMatchChecking: (data: matchOtpEntity) => Promise<boolean | null>;
  verifyOtpTrue: (data: string) => Promise<boolean | null>;

  //profile repository
  profileEdit: (data: UserEntity) => Promise<UserEntity | null>;
  uploadPhoto: (
    userId: string,
    profilePhoto: string
  ) => Promise<UserEntity | null>;
  switchRole: (id: string) => Promise<UserEntity | null>;

  // course Repository
  allCoursesRepo: (
    page: number,
    limit: number,
    search?: string,
    category?: string
  ) => Promise<CourseEntity[] | null>;
  getCoursesCountRepo: () => Promise<number>;

  courseDetailsRepo: (courseId: string) => Promise<CourseEntity | null>;
  similarCourseRepo: (courseId: string) => Promise<CourseEntity[] | null>;
  latestCoursesRepo: () => Promise<CourseEntity[] | null>;

}