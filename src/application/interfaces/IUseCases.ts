
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
} from "../../domain/IUseCases/IAdminuseCases/IAdminUserUseCase";

import {
  IGetInstructorApplicationUseCase,
  IUpdateInstructorStatusUseCase,
} from "../../domain/IUseCases/IAdminuseCases/IAdminInstructorUseCase";

import { IApplyInstructorUseCase } from "../../domain/IUseCases/IInstructorUseCases/IApplyInstructorUseCase";
import { IDependencies } from "./IDependencies";

export interface IUseCases {
  // Common Auth Use Cases
  // checkByNameUseCase: (name: string) => Promise<boolean | null>;

  checkByNameUseCase:(dependencies: IDependencies)=> ICheckByNameUseCase;
  checkByEmailUseCase:(dependencies: IDependencies)=> ICheckByEmailUseCase;
  createUserUseCase:(dependencies: IDependencies)=> ICreateUserUseCase;
  verifyOtpUseCase:(dependencies: IDependencies)=> IVerifyOtpUseCase;
  otpMatchCheckingUseCase:(dependencies: IDependencies)=> IOtpMatchCheckingUseCase;
  verifyOtpTrueUseCase:(dependencies: IDependencies)=> IVerifyOtpTrueUseCase;
  loginUseCase:(dependencies: IDependencies)=> ILoginUseCase;
  getUserDetailsUseCase:(dependencies: IDependencies)=> IGetUserDetailsUseCase;
  googleAuthUseCase:(dependencies: IDependencies)=> IGoogleAuthUseCase;
  // profileEditUseCase: (dependencies: IDependencies)=>IProfileEditUseCase;
  // changePasswordUseCase:(dependencies: IDependencies)=> IChangePasswordUseCase;
  // uploadPhotoUseCase:(dependencies: IDependencies)=> IUploadPhotoUseCase;

  // Admin Use Cases
  // getStudentsListUseCase:(dependencies: IDependencies)=> IGetStudentsListUseCase;
  // blockUnblockUserUseCase:(dependencies: IDependencies)=> IBlock_UnBlockUserUseCase;
  // addCategoryUseCase:(dependencies: IDependencies)=> IAddCategoryUseCase;
  // getCategoryListUseCase: (dependencies: IDependencies)=>IGetCategoryListUseCase;
  // blockUnblockCategoryUseCase:(dependencies: IDependencies)=> IBlock_UnblockCategoryUseCase;
  // categoryEditUseCase:(dependencies: IDependencies)=> ICategoryEditUseCase;
  // getInstructorApplicationUseCase:(dependencies: IDependencies)=> IGetInstructorApplicationUseCase;
  // updateInstructorStatusUseCase: (dependencies: IDependencies)=>IUpdateInstructorStatusUseCase;

  // // Instructor Use Cases
  // applyInstructorUseCase: (dependencies: IDependencies)=>IApplyInstructorUseCase;
}









// import {
//   IAddCategoryUseCase,
//   IBlock_UnblockCategoryUseCase,
//   ICategoryEditUseCase,
//   IGetCategoryListUseCase,
// } from "../../domain/IUseCases/IAdminuseCases/ICategoryUseCase";
// import { IApplyInstructorUseCase } from "../../domain/IUseCases/IInstructorUseCases/IApplyInstructorUseCase";
// import { IDependencies } from "./IDependencies";
// import {
//   IBlock_UnBlockUserUseCase,
//   IGetStudentsListUseCase,
// } from "../../domain/IUseCases/IAdminuseCases/IAdminUserUseCase";
// import {
//   IGetInstructorApplicationUseCase,
//   IUpdateInstructorStatusUseCase,
// } from "../../domain/IUseCases/IAdminuseCases/IAdminInstructorUseCase";
// import {
//   ICheckByEmailUseCase,
//   ICheckByNameUseCase,
//   ICreateUserUseCase,
//   IGetUserDetailsUseCase,
//   IGoogleAuthUseCase,
//   ILoginUseCase,
// } from "../../domain/IUseCases/IAuthUseCases/IUserUseCase";
// import {
//   IOtpMatchCheckingUseCase,
//   IVerifyOtpTrueUseCase,
//   IVerifyOtpUseCase,
// } from "../../domain/IUseCases/IAuthUseCases/IOtpUseCase";
// import { IChangePasswordUseCase, IProfileEditUseCase, IUploadPhotoUseCase } from "../../domain/IUseCases/IAuthUseCases/IProfileUseCase";

// export interface IUseCases {
//   // common

//   checkByNameUseCase: (dependencies: IDependencies) => ICheckByNameUseCase;
//   checkByEmailUseCase: (dependencies: IDependencies) => ICheckByEmailUseCase;
//   createUserUseCase: (dependencies: IDependencies) => ICreateUserUseCase;
//   verifyOtpUseCase: (dependencies: IDependencies) => IVerifyOtpUseCase;
//   otpMatchCheckingUseCase: (
//     dependencies: IDependencies
//   ) => IOtpMatchCheckingUseCase;
//   verifyOtpTrueUseCase: (dependencies: IDependencies) => IVerifyOtpTrueUseCase;
//   loginUseCase: (dependencies: IDependencies) => ILoginUseCase;
//   getUserDetailsUseCase: (
//     dependencies: IDependencies
//   ) => IGetUserDetailsUseCase;
//   googleAuthUseCase:(dependencies:IDependencies)=>IGoogleAuthUseCase

//   ProfileEditUseCase:(dependencies:IDependencies)=>IProfileEditUseCase

//   changePasswordUseCase:(dependencies:IDependencies)=>IChangePasswordUseCase
//   uploadPhotoUseCase :(dependencies:IDependencies) =>IUploadPhotoUseCase

//   //admin

//   getStudentsListUseCase: (
//     dependencies: IDependencies
//   ) => IGetStudentsListUseCase;
//   block_UnBlockUserUseCase: (
//     dependencies: IDependencies
//   ) => IBlock_UnBlockUserUseCase;
//   addCategoryUseCase: (dependencies: IDependencies) => IAddCategoryUseCase;
//   getCategoryListUseCase: (
//     dependencies: IDependencies
//   ) => IGetCategoryListUseCase;
//   block_UnblockCategoryUseCase: (
//     dependencies: IDependencies
//   ) => IBlock_UnblockCategoryUseCase;
//   categoryEditUseCase: (dependencies: IDependencies) => ICategoryEditUseCase;
//   getInstructorApplicationUseCase: (
//     dependencies: IDependencies
//   ) => IGetInstructorApplicationUseCase;
//   updateInstructorStatusUseCase: (
//     dependencies: IDependencies
//   ) => IUpdateInstructorStatusUseCase;

//   //instructor

//   applyInstructorUseCase: (
//     dependencies: IDependencies
//   ) => IApplyInstructorUseCase;
// }
