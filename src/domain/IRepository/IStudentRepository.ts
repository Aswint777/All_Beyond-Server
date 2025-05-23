import { Message } from "aws-sdk/clients/cloudwatch";
import {
  AddMember,
  AddMemberData,
  ChatGroup,
  TextMessage,
  UserChatList,
} from "../entities/chatEntity";
import { CourseEntity } from "../entities/courseEntity";
import {
  CourseOutput,
  EnrolmentEntity,
  StudentDashboardData,
} from "../entities/enrolmentEntity";
import { AverageReview, ReviewData } from "../entities/overviewEntity";
import { PaymentEntity } from "../entities/paymentEntity";
import { ProgressEntity } from "../entities/progressEntity";
import {
  Answers,
  AssessmentResponse,
  CertificateDetails,
  ExamAssessment,
  ExamResult,
} from "../entities/assessmentEntity";

export interface IStudentRepository {
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

  createChatRepository: (data: ChatGroup) => Promise<ChatGroup | null>;
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
