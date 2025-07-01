import {
  ICheckByEmailUseCase,
  ICheckByNameUseCase,
  ICreateUserUseCase,
  IGetUserDetailsUseCase,
  IGoogleAuthUseCase,
  ILoginUseCase,
  IOnlineUseCase,
} from "../../domain/IUseCases/IAuthUseCases/IUserUseCase";

import {
  IOtpMatchCheckingUseCase,
  IResetPasswordUseCase,
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
  IGetInstructorUseCase,
  IUpdateInstructorStatusUseCase,
} from "../../domain/IUseCases/IAdminuseCases/IAdminInstructorUseCase";

import {
  IApplyInstructorUseCase,
  IInstructorDashboardUseCase,
  IInstructorTransactionsUseCase,
} from "../../domain/IUseCases/IInstructorUseCases/IApplyInstructorUseCase";
import { IDependencies } from "./IDependencies";
import {
  IAllCategoriesUseCase,
  IBlockCourseUseCase,
  ICreateCourseUseCase,
  IEditCourseUseCase,
  IListInstructorCourseUseCase,
} from "../../domain/IUseCases/IInstructorUseCases/ICourseUseCase";
import {
  allCoursesUseCase,
  ICourseDetailsUseCase,
  IGetTotalCount,
  ILatestCoursesUseCase,
  ISimilarCourseUseCase,
} from "../../domain/IUseCases/IAuthUseCases/ICourseUseCase";
import {
  IAlreadyEnrolledUseCase,
  ICoursePaymentUseCase,
  IEnrolCourseUseCases,
  IGetProgressUseCase,
  IInitializeProgressUseCase,
  IStudentCoursesUseCase,
  IUpdateProgressUseCase,
  IWatchCourseUseCase,
} from "../../domain/IUseCases/IStudentUseCases/IEnrolmentUseCase";
import { IDashboardUseCase } from "../../domain/IUseCases/IAdminuseCases/IOverviewUseCase";
import {
  IAddReviewUseCase,
  IAverageReviewUseCase,
  IGetReviewUseCase,
  IStudentDashboardUseCase,
  IStudentTransactionsUseCase,
} from "../../domain/IUseCases/IStudentUseCases/IStudentOverviewUseCase";
import {
  IAddMemberUseCase,
  ICreateChatUseCase,
  IGetChatMessagesUseCase,
  IGetLastMessageUseCase,
  IGetUserChatsUseCase,
  ISendMessagesUseCase,
  IVideoChatListUseCase,
} from "../../domain/IUseCases/IStudentUseCases/IChatUseCase";
import {
  IAssessmentCoursesUseCase,
  ICreateAssessmentsUseCase,
  IGetAssessmentUseCase,
  IUpdateAssessmentUseCase,
} from "../../domain/IUseCases/IInstructorUseCases/IAssessmentUseCase";
import {
  ICertificateUseCase,
  IGetQuestionsUseCase,
  IStudentAssessmentsUseCase,
  ISubmitAssessmentUseCase,
} from "../../domain/IUseCases/IStudentUseCases/IExamUseCase";
import { IAssessmentNotificationUpdate, ICreateAssessmentNotification, IGetNotificationsUseCase } from "../../domain/IUseCases/IStudentUseCases/INotificationUseCase";

export interface IUseCases {
  // Common Auth Use Cases

  checkByNameUseCase: (dependencies: IDependencies) => ICheckByNameUseCase;
  checkByEmailUseCase: (dependencies: IDependencies) => ICheckByEmailUseCase;
  createUserUseCase: (dependencies: IDependencies) => ICreateUserUseCase;
  loginUseCase: (dependencies: IDependencies) => ILoginUseCase;
  getUserDetailsUseCase: (
    dependencies: IDependencies
  ) => IGetUserDetailsUseCase;
  googleAuthUseCase: (dependencies: IDependencies) => IGoogleAuthUseCase;
  onlineUseCase: (dependencies: IDependencies) => IOnlineUseCase;

  verifyOtpUseCase: (dependencies: IDependencies) => IVerifyOtpUseCase;
  otpMatchCheckingUseCase: (
    dependencies: IDependencies
  ) => IOtpMatchCheckingUseCase;
  verifyOtpTrueUseCase: (dependencies: IDependencies) => IVerifyOtpTrueUseCase;
    resetPasswordUseCase: (dependencies: IDependencies) => IResetPasswordUseCase;


  allCoursesUseCase: (dependencies: IDependencies) => allCoursesUseCase;
  getTotalCount: (dependencies: IDependencies) => IGetTotalCount;
  courseDetailsUseCase: (dependencies: IDependencies) => ICourseDetailsUseCase;
  similarCourseUseCase: (dependencies: IDependencies) => ISimilarCourseUseCase;

  profileEditUseCase: (dependencies: IDependencies) => IProfileEditUseCase;
  changePasswordUseCase: (
    dependencies: IDependencies
  ) => IChangePasswordUseCase;
  uploadPhotoUseCase: (dependencies: IDependencies) => IUploadPhotoUseCase;
  switchUserRoleUseCase: (
    dependencies: IDependencies
  ) => ISwitchUserRoleUseCase;

  latestCoursesUseCase: (dependencies: IDependencies) => ILatestCoursesUseCase;

  // Admin Use Cases
  getStudentsListUseCase: (
    dependencies: IDependencies
  ) => IGetStudentsListUseCase;
  blockUnblockUserUseCase: (
    dependencies: IDependencies
  ) => IBlock_UnBlockUserUseCase;
  userDetailsUseCase: (dependency: IDependencies) => IUserDetailsUseCase;
  transactionHistoryUseCase: (
    dependency: IDependencies
  ) => ITransactionHistoryUseCase;

  addCategoryUseCase: (dependencies: IDependencies) => IAddCategoryUseCase;
  getCategoryListUseCase: (
    dependencies: IDependencies
  ) => IGetCategoryListUseCase;
  blockUnblockCategoryUseCase: (
    dependencies: IDependencies
  ) => IBlock_UnblockCategoryUseCase;
  categoryEditUseCase: (dependencies: IDependencies) => ICategoryEditUseCase;

  getInstructorApplicationUseCase: (
    dependencies: IDependencies
  ) => IGetInstructorApplicationUseCase;

  getInstructorUseCase: (dependencies: IDependencies) => IGetInstructorUseCase;
  updateInstructorStatusUseCase: (
    dependencies: IDependencies
  ) => IUpdateInstructorStatusUseCase;

  dashboardUseCase: (dependencies: IDependencies) => IDashboardUseCase;

  // Instructor Use Cases
  applyInstructorUseCase: (
    dependencies: IDependencies
  ) => IApplyInstructorUseCase;
  listInstructorCourseUseCase: (
    dependencies: IDependencies
  ) => IListInstructorCourseUseCase;

  createCourseUseCase: (dependencies: IDependencies) => ICreateCourseUseCase;
  allCategoriesUseCase: (dependencies: IDependencies) => IAllCategoriesUseCase;
  editCourseUseCase: (dependencies: IDependencies) => IEditCourseUseCase;
  blockCourseUseCase: (dependencies: IDependencies) => IBlockCourseUseCase;

  instructorDashboardUseCase: (
    dependency: IDependencies
  ) => IInstructorDashboardUseCase;

    instructorTransactionsUseCase: (
    dependency: IDependencies
  ) => IInstructorTransactionsUseCase;

  assessmentCoursesUseCase: (
    dependencies: IDependencies
  ) => IAssessmentCoursesUseCase;
  createAssessmentsUseCase: (
    dependencies: IDependencies
  ) => ICreateAssessmentsUseCase;
  getAssessmentUseCase: (dependencies: IDependencies) => IGetAssessmentUseCase;
  updateAssessmentUseCase: (
    dependencies: IDependencies
  ) => IUpdateAssessmentUseCase;

  // Student Use Case
  coursePaymentUseCase: (dependency: IDependencies) => ICoursePaymentUseCase;
  enrolCourseUseCases: (dependency: IDependencies) => IEnrolCourseUseCases;
  studentCoursesUseCase: (dependency: IDependencies) => IStudentCoursesUseCase;
  watchCourseUseCase: (dependency: IDependencies) => IWatchCourseUseCase;
  alreadyEnrolledUseCase: (
    dependency: IDependencies
  ) => IAlreadyEnrolledUseCase;

  initializeProgressUseCase: (
    dependency: IDependencies
  ) => IInitializeProgressUseCase;
  getProgressUseCase: (dependency: IDependencies) => IGetProgressUseCase;
  updateProgressUseCase: (dependency: IDependencies) => IUpdateProgressUseCase;

  studentDashboardUseCase: (
    dependency: IDependencies
  ) => IStudentDashboardUseCase;
  addReviewUseCase: (dependency: IDependencies) => IAddReviewUseCase;
  getReviewUseCase: (dependency: IDependencies) => IGetReviewUseCase;
  averageReviewUseCase: (dependency: IDependencies) => IAverageReviewUseCase;

  createChatUseCase: (dependency: IDependencies) => ICreateChatUseCase;
  addMemberUseCase: (dependency: IDependencies) => IAddMemberUseCase;
  getUserChatsUseCase: (dependency: IDependencies) => IGetUserChatsUseCase;
  getChatMessagesUseCase: (
    dependency: IDependencies
  ) => IGetChatMessagesUseCase;
  sendMessagesUseCase: (dependency: IDependencies) => ISendMessagesUseCase;
  getLastMessageUseCase: (dependency: IDependencies) => IGetLastMessageUseCase;

  videoChatListUseCase: (dependency: IDependencies) => IVideoChatListUseCase;

  studentAssessmentsUseCase: (
    dependencies: IDependencies
  ) => IStudentAssessmentsUseCase;

  getQuestionsUseCase: (dependency: IDependencies) => IGetQuestionsUseCase;
  submitAssessmentUseCase: (
    dependency: IDependencies
  ) => ISubmitAssessmentUseCase;
  certificateUseCase: (dependency: IDependencies) => ICertificateUseCase;

  assessmentNotificationUpdate: (
    dependency: IDependencies
  ) => IAssessmentNotificationUpdate;

  
  createAssessmentNotification: (
    dependency: IDependencies
  ) => ICreateAssessmentNotification;

  getNotificationsUseCase: (
    dependency: IDependencies
  ) => IGetNotificationsUseCase;

      studentTransactionsUseCase: (
    dependency: IDependencies
  ) => IStudentTransactionsUseCase;
}
