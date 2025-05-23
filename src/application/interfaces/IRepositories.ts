import { promises } from "dns";
import { createUserEntity, UserEntity } from "../../domain/entities/User";
import {
  matchOtpEntity,
  verifyOtpEntity,
} from "../../domain/entities/verifyOtpEntity";
import { categoryEntity } from "../../domain/entities/categoryEntity";
import { ICreateUserUseCase } from "../../domain/IUseCases/IAuthUseCases/IUserUseCase";
import { CourseEntity } from "../../domain/entities/courseEntity";
import {
  PaymentEntity,
  TransactionOutput,
} from "../../domain/entities/paymentEntity";
import {
  CourseOutput,
  DashboardData,
  EnrolmentEntity,
  InstructorDashboardData,
  StudentDashboardData,
} from "../../domain/entities/enrolmentEntity";
import { ProgressEntity } from "../../domain/entities/progressEntity";
import {
  AverageReview,
  ReviewData,
} from "../../domain/entities/overviewEntity";
import {
  AddMember,
  AddMemberData,
  ChatGroup,
  ChatGroupInput,
  Message,
  TextMessage,
  UserChatList,
} from "../../domain/entities/chatEntity";
import {
  Answers,
  assessmentCourses,
  AssessmentEntity,
  AssessmentResponse,
  CertificateDetails,
  ExamAssessment,
  ExamResult,
  QuestionEntity,
} from "../../domain/entities/assessmentEntity";

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

  // => Admin Repository

  // adminUserRepository
  getStudentsList: () => Promise<UserEntity[] | boolean | null>;
  block_UnBlockUser: (
    userId: string,
    isBlocked: boolean
  ) => Promise<boolean | null>;

  findByUserId: (userId: string) => Promise<UserEntity | null>;
  transactionHistoryRepository: (
    skip: number,
    limit: number
  ) => Promise<{
    transactions: TransactionOutput[];
    totalTransactions: number;
  } | null>;

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
    description: string
  ) => Promise<categoryEntity | null>;
  duplicateCategory: (
    name: string,
    id?: string
  ) => Promise<categoryEntity[] | null>;

  //overview repo

  dashboardRepository: () => Promise<DashboardData | null>;

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
  listInstructorRepository: (
    id: string,
    search: string,
    skip: number,
    limit: number
  ) => Promise<{ courses: CourseEntity[]; totalCourses: number } | null>;

  editCourseRepository: (data: CourseEntity) => Promise<CourseEntity | null>;
  blockCourseRepository: (courseId: string) => Promise<CourseEntity | null>;
  instructorDashboardRepository: (
    userId: string
  ) => Promise<InstructorDashboardData | null>;

  assessmentCoursesRepository: (
    userId: string,
    page: number,
    limit: number,
    search: string
  ) => Promise<{ courses: assessmentCourses[]; totalPages: number } | null>;
  createAssessmentsRepository: (
    data: AssessmentEntity
  ) => Promise<AssessmentEntity | null>;
  getAssessmentRepository: (
    assessmentId: string
  ) => Promise<AssessmentEntity | null>;

  updateAssessmentRepository: (
    assessmentId: string,
    data: { questions: QuestionEntity[] }
  ) => Promise<AssessmentEntity | null>;

  // => student
  coursePaymentRepository: (
    data: PaymentEntity
  ) => Promise<PaymentEntity | null>;
  enrolCourseRepository: (
    data: EnrolmentEntity
  ) => Promise<EnrolmentEntity | null>;
  studentCoursesRepository: (
    userId: string,
    safeSearch: string,
    skip: number,
    limitNum: number
  ) => Promise<{ courses: CourseEntity[]; totalCourses: number } | null>;

  watchCourseRepository: (
    courseId: string,
    userId: string
  ) => Promise<CourseOutput | null>;

  alreadyEnrolledRepository: (
    courseId: string,
    userId: string
  ) => Promise<boolean | null>;

  initializeProgressRepository: (
    courseId: string,
    userId: string
  ) => Promise<ProgressEntity | null>;
  getProgressRepository: (
    courseId: string,
    userId: string
  ) => Promise<ProgressEntity | null>;
  updateProgressRepository: (
    courseId: string,
    userId: string,
    lessonId: string
  ) => Promise<ProgressEntity | null>;
  studentDashboardRepository: (
    userId: string
  ) => Promise<StudentDashboardData | null>;
  addReviewRepository: (data: ReviewData) => Promise<ReviewData | null>;
  getReviewRepository: (courseId: string) => Promise<ReviewData[] | null>;
  averageReviewRepository: (courseId: string) => Promise<AverageReview | null>;

  createChatRepository: (data: ChatGroupInput) => Promise<ChatGroup | null>;
  addMemberRepository: (data: AddMember) => Promise<AddMemberData | null>;

  getUserChatsRepository: (userId: string) => Promise<UserChatList[] | null>;
  getChatMessagesRepository: (chatId: string) => Promise<Message[] | null>;
  sendMessagesRepository: (data: TextMessage) => Promise<Message | null>;

  studentAssessmentsRepository: (
    userId: string,
    page: number,
    limit: number,
    search: string
  ) => Promise<AssessmentResponse | null>;

  getQuestionsRepository: (
    assessmentId: string
  ) => Promise<ExamAssessment | null>;

  submitAssessmentRepository: (
    assessmentId: string,
    userId: string,
    answers: { answers: Answers[] }
  ) => Promise<ExamResult | null>;

  certificateRepository: (
    assessmentId: string,
    userId: string
  ) => Promise<CertificateDetails | null>;
}

// import { IAdminRepository } from "../../domain/IRepository/IAdminRepository";
// import { IAuthRepository } from "../../domain/IRepository/IAuthRepository";
// import { IInstructorRepository } from "../../domain/IRepository/IInstructorRepository";
// import { IStudentRepository } from "../../domain/IRepository/IStudentRepository";

// export type IRepositories = IAuthRepository &
//   IAdminRepository &
//   IInstructorRepository &
//   IStudentRepository;
