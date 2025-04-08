
import {
  ICheckByEmailUseCase,
  ICheckByNameUseCase,
  ICreateUserUseCase,
  IGetUserDetailsUseCase,
  IGoogleAuthUseCase,
  ILoginUseCase,
} from "../../domain/IUseCases/IAuthUseCases/IUserUseCase";

import {
  IOtpMatchCheckingUseCase,
  IVerifyOtpTrueUseCase,
  IVerifyOtpUseCase,
} from "../../domain/IUseCases/IAuthUseCases/IOtpUseCase";

import {
  IChangePasswordUseCase,
  IProfileEditUseCase,
  ISwitchUserRoleUseCase,
  IUploadPhotoUseCase,
} from "../../domain/IUseCases/IAuthUseCases/IProfileUseCase";

import {
  IAddCategoryUseCase,
  IBlock_UnblockCategoryUseCase,
  ICategoryEditUseCase,
  IGetCategoryListUseCase,
} from "../../domain/IUseCases/IAdminuseCases/ICategoryUseCase";

import {
  IBlock_UnBlockUserUseCase,
  IGetStudentsListUseCase,
  IUserDetailsUseCase,
} from "../../domain/IUseCases/IAdminuseCases/IAdminUserUseCase";

import {
  IGetInstructorApplicationUseCase,
  IUpdateInstructorStatusUseCase,
} from "../../domain/IUseCases/IAdminuseCases/IAdminInstructorUseCase";

import { IApplyInstructorUseCase } from "../../domain/IUseCases/IInstructorUseCases/IApplyInstructorUseCase";
import { IDependencies } from "./IDependencies";
import { IAllCategoriesUseCase, IBlockCourseUseCase, ICreateCourseUseCase, IEditCourseUseCase, IListInstructorCourseUseCase,} from "../../domain/IUseCases/IInstructorUseCases/ICourseUseCase";
import { allCoursesUseCase, ICourseDetailsUseCase, IGetTotalCount, ISimilarCourseUseCase } from "../../domain/IUseCases/IAuthUseCases/ICourseUseCase";
import { ICoursePaymentUseCase, IEnrolCourseUseCases } from "../../domain/IUseCases/IStudentUseCases/IEnrolmentUseCase";

export interface IUseCases {
  // Common Auth Use Cases

  checkByNameUseCase:(dependencies: IDependencies)=> ICheckByNameUseCase;
  checkByEmailUseCase:(dependencies: IDependencies)=> ICheckByEmailUseCase;
  createUserUseCase:(dependencies: IDependencies)=> ICreateUserUseCase;
  loginUseCase:(dependencies: IDependencies)=> ILoginUseCase;
  getUserDetailsUseCase:(dependencies: IDependencies)=> IGetUserDetailsUseCase;
  googleAuthUseCase:(dependencies: IDependencies)=> IGoogleAuthUseCase;

  verifyOtpUseCase:(dependencies: IDependencies)=> IVerifyOtpUseCase;
  otpMatchCheckingUseCase:(dependencies: IDependencies)=> IOtpMatchCheckingUseCase;
  verifyOtpTrueUseCase:(dependencies: IDependencies)=> IVerifyOtpTrueUseCase;

  allCoursesUseCase:(dependencies:IDependencies)=>allCoursesUseCase
  getTotalCount :(dependencies:IDependencies)=>IGetTotalCount
  courseDetailsUseCase:(dependencies:IDependencies)=>ICourseDetailsUseCase
  similarCourseUseCase:(dependencies:IDependencies)=>ISimilarCourseUseCase
  
  profileEditUseCase: (dependencies: IDependencies)=>IProfileEditUseCase;
  changePasswordUseCase:(dependencies: IDependencies)=> IChangePasswordUseCase;
  uploadPhotoUseCase:(dependencies: IDependencies)=> IUploadPhotoUseCase;
  switchUserRoleUseCase:(dependencies:IDependencies)=>ISwitchUserRoleUseCase

  // Admin Use Cases
  getStudentsListUseCase:(dependencies: IDependencies)=> IGetStudentsListUseCase;
  blockUnblockUserUseCase:(dependencies: IDependencies)=> IBlock_UnBlockUserUseCase;
  userDetailsUseCase:(dependency:IDependencies)=>IUserDetailsUseCase
  
  addCategoryUseCase:(dependencies: IDependencies)=> IAddCategoryUseCase;
  getCategoryListUseCase: (dependencies: IDependencies)=>IGetCategoryListUseCase;
  blockUnblockCategoryUseCase:(dependencies: IDependencies)=> IBlock_UnblockCategoryUseCase;
  categoryEditUseCase:(dependencies: IDependencies)=> ICategoryEditUseCase;

  getInstructorApplicationUseCase:(dependencies: IDependencies)=> IGetInstructorApplicationUseCase;
  updateInstructorStatusUseCase: (dependencies: IDependencies)=>IUpdateInstructorStatusUseCase;

  // Instructor Use Cases
  applyInstructorUseCase: (dependencies: IDependencies)=>IApplyInstructorUseCase;
  listInstructorCourseUseCase : (dependencies:IDependencies)=>IListInstructorCourseUseCase

  createCourseUseCase : (dependencies:IDependencies)=>ICreateCourseUseCase
  allCategoriesUseCase : (dependencies:IDependencies)=>IAllCategoriesUseCase
  editCourseUseCase : (dependencies:IDependencies)=>IEditCourseUseCase
  blockCourseUseCase : (dependencies:IDependencies)=>IBlockCourseUseCase

  // Student Use Case
  coursePaymentUseCase :(dependency:IDependencies)=>ICoursePaymentUseCase
  enrolCourseUseCases :(dependency:IDependencies)=>IEnrolCourseUseCases
}

