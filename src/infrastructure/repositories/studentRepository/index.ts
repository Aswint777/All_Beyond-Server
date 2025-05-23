import { IDependencies } from "../../../application/interfaces/IDependencies";
import { Answers } from "../../../domain/entities/assessmentEntity";
import {
  AddMember,
  AddMemberData,
  ChatGroup,
  ChatGroupInput,
  TextMessage,
} from "../../../domain/entities/chatEntity";
import { EnrolmentEntity } from "../../../domain/entities/enrolmentEntity";
import { ReviewData } from "../../../domain/entities/overviewEntity";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";
import { ChatRepository } from "./chatRepository";
import { EnrolmentRepository } from "./enrolmentRepository";
import { ExamRepository } from "./examRepository";
import { OverViewRepository } from "./overviewRepository";
import { ProgressRepository } from "./progressRepository";

export const studentRepositories = (dependencies: IDependencies) => {
  const enrolmentRepository = new EnrolmentRepository(dependencies);
  const progressRepository = new ProgressRepository(dependencies);
  const overViewRepository = new OverViewRepository(dependencies);
  const chatRepository = new ChatRepository(dependencies);
  const examRepository = new ExamRepository(dependencies);
  return {
    coursePaymentRepository: (data: PaymentEntity) =>
      enrolmentRepository.coursePaymentRepository(data),
    enrolCourseRepository: (data: EnrolmentEntity) =>
      enrolmentRepository.enrolCourseRepository(data),

    studentCoursesRepository: (
      userId: string,
      safeSearch: string,
      skip: number,
      limitNum: number
    ) =>
      enrolmentRepository.studentCoursesRepository(
        userId,
        safeSearch,
        skip,
        limitNum
      ),
    watchCourseRepository: (courseId: string, userId: string) =>
      enrolmentRepository.watchCourseRepository(courseId, userId),

    alreadyEnrolledRepository: (courseId: string, userId: string) =>
      enrolmentRepository.alreadyEnrolledRepository(courseId, userId),
    initializeProgressRepository: (courseId: string, userId: string) =>
      progressRepository.initializeProgressRepository(courseId, userId),
    getProgressRepository: (courseId: string, userId: string) =>
      progressRepository.getProgressRepository(courseId, userId),
    updateProgressRepository: (
      courseId: string,
      userId: string,
      lessonId: string
    ) =>
      progressRepository.updateProgressRepository(courseId, userId, lessonId),
    studentDashboardRepository: (userId: string) =>
      overViewRepository.studentDashboardRepository(userId),
    addReviewRepository: (data: ReviewData) =>
      overViewRepository.addReviewRepository(data),

    getReviewRepository: (courseId: string) =>
      overViewRepository.getReviewRepository(courseId),
    averageReviewRepository: (courseId: string) =>
      overViewRepository.averageReviewRepository(courseId),

    createChatRepository: (data: ChatGroupInput) =>
      chatRepository.createChatRepository(data),
    addMemberRepository: (data: AddMember) =>
      chatRepository.addMemberRepository(data),
    getUserChatsRepository: (userId: string) =>
      chatRepository.getUserChatsRepository(userId),
    getChatMessagesRepository: (chatId: string) =>
      chatRepository.getChatMessagesRepository(chatId),
    sendMessagesRepository: (data: TextMessage) =>
      chatRepository.sendMessagesRepository(data),

    studentAssessmentsRepository: (
      userId: string,
      page: number,
      limit: number,
      search: string
    ) =>
      examRepository.studentAssessmentsRepository(userId, page, limit, search),

    getQuestionsRepository: (assessmentId: string) =>
      examRepository.getQuestionsRepository(assessmentId),

    submitAssessmentRepository: (
      assessmentId: string,
      userId: string,
      answers:{answers: Answers[]}
    ) =>
      examRepository.submitAssessmentRepository(assessmentId, userId, answers),

          certificateRepository: (
      assessmentId: string,
      userId: string,
    ) =>
      examRepository.certificateRepository(assessmentId, userId),

      
  };

};
