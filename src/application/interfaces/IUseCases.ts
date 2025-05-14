
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
  ITransactionHistoryUseCase,
  IUserDetailsUseCase,
} from "../../domain/IUseCases/IAdminuseCases/IAdminUserUseCase";

import {
  IGetInstructorApplicationUseCase,
  IUpdateInstructorStatusUseCase,
} from "../../domain/IUseCases/IAdminuseCases/IAdminInstructorUseCase";

import { IApplyInstructorUseCase, IInstructorDashboardUseCase } from "../../domain/IUseCases/IInstructorUseCases/IApplyInstructorUseCase";
import { IDependencies } from "./IDependencies";
import { IAllCategoriesUseCase, IBlockCourseUseCase, ICreateCourseUseCase, IEditCourseUseCase, IListInstructorCourseUseCase,} from "../../domain/IUseCases/IInstructorUseCases/ICourseUseCase";
import { allCoursesUseCase, ICourseDetailsUseCase, IGetTotalCount, ISimilarCourseUseCase } from "../../domain/IUseCases/IAuthUseCases/ICourseUseCase";
import { IAlreadyEnrolledUseCase, ICoursePaymentUseCase, IEnrolCourseUseCases, IGetProgressUseCase, IInitializeProgressUseCase, IStudentCoursesUseCase, IUpdateProgressUseCase, IWatchCourseUseCase } from "../../domain/IUseCases/IStudentUseCases/IEnrolmentUseCase";
import { IDashboardUseCase } from "../../domain/IUseCases/IAdminuseCases/IOverviewUseCase";
import { IAddReviewUseCase, IAverageReviewUseCase, IGetReviewUseCase, IStudentDashboardUseCase } from "../../domain/IUseCases/IStudentUseCases/IStudentOverviewUseCase";
import { IAddMemberUseCase, ICreateChatUseCase, IGetChatMessagesUseCase, IGetUserChatsUseCase, ISendMessagesUseCase } from "../../domain/IUseCases/IStudentUseCases/IChatUseCase";
import { IAssessmentCoursesUseCase, ICreateAssessmentsUseCase } from "../../domain/IUseCases/IInstructorUseCases/IAssessmentUseCase";

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
  transactionHistoryUseCase:(dependency:IDependencies)=>ITransactionHistoryUseCase 
  
  addCategoryUseCase:(dependencies: IDependencies)=> IAddCategoryUseCase;
  getCategoryListUseCase: (dependencies: IDependencies)=>IGetCategoryListUseCase;
  blockUnblockCategoryUseCase:(dependencies: IDependencies)=> IBlock_UnblockCategoryUseCase;
  categoryEditUseCase:(dependencies: IDependencies)=> ICategoryEditUseCase;

  getInstructorApplicationUseCase:(dependencies: IDependencies)=> IGetInstructorApplicationUseCase;
  updateInstructorStatusUseCase: (dependencies: IDependencies)=>IUpdateInstructorStatusUseCase;

  dashboardUseCase:(dependencies: IDependencies)=>IDashboardUseCase

  // Instructor Use Cases
  applyInstructorUseCase: (dependencies: IDependencies)=>IApplyInstructorUseCase;
  listInstructorCourseUseCase : (dependencies:IDependencies)=>IListInstructorCourseUseCase

  createCourseUseCase : (dependencies:IDependencies)=>ICreateCourseUseCase
  allCategoriesUseCase : (dependencies:IDependencies)=>IAllCategoriesUseCase
  editCourseUseCase : (dependencies:IDependencies)=>IEditCourseUseCase
  blockCourseUseCase : (dependencies:IDependencies)=>IBlockCourseUseCase

  instructorDashboardUseCase:(dependency:IDependencies)=>IInstructorDashboardUseCase

    assessmentCoursesUseCase : (dependencies:IDependencies)=>IAssessmentCoursesUseCase
    createAssessmentsUseCase : (dependencies:IDependencies)=>ICreateAssessmentsUseCase



  // Student Use Case
  coursePaymentUseCase :(dependency:IDependencies)=>ICoursePaymentUseCase
  enrolCourseUseCases :(dependency:IDependencies)=>IEnrolCourseUseCases
  studentCoursesUseCase :(dependency:IDependencies)=>IStudentCoursesUseCase
  watchCourseUseCase:(dependency:IDependencies)=>IWatchCourseUseCase
  alreadyEnrolledUseCase:(dependency:IDependencies)=>IAlreadyEnrolledUseCase

  initializeProgressUseCase:(dependency:IDependencies)=>IInitializeProgressUseCase
  getProgressUseCase:(dependency:IDependencies)=>IGetProgressUseCase
  updateProgressUseCase:(dependency:IDependencies)=>IUpdateProgressUseCase
  
  studentDashboardUseCase:(dependency:IDependencies)=>IStudentDashboardUseCase
  addReviewUseCase:(dependency:IDependencies)=>IAddReviewUseCase
  getReviewUseCase:(dependency:IDependencies)=>IGetReviewUseCase
  averageReviewUseCase:(dependency:IDependencies)=>IAverageReviewUseCase

  createChatUseCase:(dependency:IDependencies)=>ICreateChatUseCase
  addMemberUseCase:(dependency:IDependencies)=>IAddMemberUseCase
  getUserChatsUseCase:(dependency:IDependencies)=>IGetUserChatsUseCase
  getChatMessagesUseCase:(dependency:IDependencies)=>IGetChatMessagesUseCase
  sendMessagesUseCase:(dependency:IDependencies)=>ISendMessagesUseCase


}

