import { promises } from "dns";
import { createUserEntity, UserEntity } from "../../domain/entities/User";
import {
  matchOtpEntity,
  verifyOtpEntity,
} from "../../domain/entities/verifyOtpEntity";
import { categoryEntity } from "../../domain/entities/categoryEntity";
import { ICreateUserUseCase } from "../../domain/IUseCases/IAuthUseCases/IUserUseCase";
import { CourseEntity } from "../../domain/entities/courseEntity";

export interface IRepositories {
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
  allCoursesRepo :(page: number, limit: number, search?:string, category?:string)=>Promise<CourseEntity[]|null>
   getCoursesCountRepo:()=> Promise<number> 

  courseDetailsRepo:(courseId:string)=>Promise<CourseEntity|null>
  similarCourseRepo:(courseId:string)=>Promise<CourseEntity[]|null>
  



  // => Admin Repository

  // adminUserRepository
  getStudentsList: () => Promise<UserEntity[] | boolean | null>;
  block_UnBlockUser: (
    userId: string,
    isBlocked: boolean
  ) => Promise<boolean | null>;

  findByUserId: (userId: string) => Promise<UserEntity | null>;

  // category repository
  addCategory: (data: categoryEntity) => Promise<categoryEntity | null>;
  getCategoryList: () => Promise<categoryEntity[] | null>;
  block_UnblockCategory: (
    id: string,
    isBlocked: boolean
  ) => Promise<boolean | null>;
  categoryEdit: (
    id: string,
    name: string,
    description: string,
  ) => Promise<categoryEntity | null>;
  duplicateCategory: (
    name: string,
    id?: string
  ) => Promise<categoryEntity[] | null>;

  // adminInstructorRepository
  getInstructorApplication: () => Promise<UserEntity[] | boolean | null>;
  updateInstructorStatus: (
    Id: string,
    status: string
  ) => Promise<UserEntity | null>;

  // => instructor

  instructorApplication: (data: UserEntity) => Promise<boolean | null>;

  createCourseRepository: (
    data: CourseEntity,
    id: string
  ) => Promise<CourseEntity | null>;
  getAllCategoryRepository: () => Promise<categoryEntity[] | null>;
  // listInstructorRepository:(id:string)=> Promise <CourseEntity[]|null>
  listInstructorRepository:(id: string,search: string,skip: number,limit: number)=> Promise<{ courses: CourseEntity[]; totalCourses: number } | null>

  editCourseRepository:(data:CourseEntity)=>Promise<CourseEntity|null>
  blockCourseRepository:(courseId:string)=>Promise<CourseEntity|null>


  // => student
}
