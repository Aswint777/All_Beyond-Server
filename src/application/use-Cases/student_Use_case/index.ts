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
import { IDependencies } from "../../interfaces/IDependencies";
import { ChatUseCase } from "./chatUseCase";
import { EnrolmentUseCase } from "./enrolmentUseCase";
import { ExamUseCase } from "./examUseCase";
import { NotificationUsCase } from "./notificationUseCase";
import { StudentOverviewUseCase } from "./overviewUseCase";
import { ProgressUseCase } from "./progressUseCase";

export const studentUseCase = (dependencies: IDependencies) => {
  const enrolmentUseCase = new EnrolmentUseCase(dependencies);
  const progressUseCase = new ProgressUseCase(dependencies);
  const studentOverviewUseCase = new StudentOverviewUseCase(dependencies);
  const chatUseCase = new ChatUseCase(dependencies);
  const examUseCase = new ExamUseCase(dependencies);
  const NotificationUseCase = new NotificationUsCase(dependencies);

  return {
    coursePaymentUseCase: () => ({
      execute: (data: PaymentEntity) =>
        enrolmentUseCase.coursePaymentUseCase(data),
    }),
    enrolCourseUseCases: () => ({
      execute: (data: EnrolmentEntity) =>
        enrolmentUseCase.enrolCourseUseCases(data),
    }),
    studentCoursesUseCase: () => ({
      execute: (
        userId: string,
        safeSearch: string,
        skip: number,
        limitNum: number
      ) =>
        enrolmentUseCase.studentCoursesUseCase(
          userId,
          safeSearch,
          skip,
          limitNum
        ),
    }),
    watchCourseUseCase: () => ({
      execute: (courseId: string, userId: string) =>
        enrolmentUseCase.watchCourseUseCase(courseId, userId),
    }),
    alreadyEnrolledUseCase: () => ({
      execute: (courseId: string, userId: string) =>
        enrolmentUseCase.alreadyEnrolledUseCase(courseId, userId),
    }),
    initializeProgressUseCase: () => ({
      execute: (courseId: string, userId: string) =>
        progressUseCase.initializeProgressUseCase(courseId, userId),
    }),
    getProgressUseCase: () => ({
      execute: (courseId: string, userId: string) =>
        progressUseCase.getProgressUseCase(courseId, userId),
    }),
    updateProgressUseCase: () => ({
      execute: (courseId: string, userId: string, lessonId: string) =>
        progressUseCase.updateProgressUseCase(courseId, userId, lessonId),
    }),

    studentDashboardUseCase: () => ({
      execute: (userId: string) =>
        studentOverviewUseCase.studentDashboardUseCase(userId),
    }),

    addReviewUseCase: () => ({
      execute: (data: ReviewData) =>
        studentOverviewUseCase.addReviewUseCase(data),
    }),
    getReviewUseCase: () => ({
      execute: (courseId: string) =>
        studentOverviewUseCase.getReviewUseCase(courseId),
    }),
    averageReviewUseCase: () => ({
      execute: (courseId: string) =>
        studentOverviewUseCase.averageReviewUseCase(courseId),
    }),

    createChatUseCase: () => ({
      execute: (data: ChatGroupInput) => chatUseCase.createChatUseCase(data),
    }),

    addMemberUseCase: () => ({
      execute: (data: AddMember) => chatUseCase.addMemberUseCase(data),
    }),
    getUserChatsUseCase: () => ({
      execute: (userId: string) => chatUseCase.getUserChatsUseCase(userId),
    }),
    getChatMessagesUseCase: () => ({
      execute: (chatId: string, userId: string) =>
        chatUseCase.getChatMessagesUseCase(chatId, userId),
    }),
    sendMessagesUseCase: () => ({
      execute: (data: TextMessage) => chatUseCase.sendMessagesUseCase(data),
    }),

    getLastMessageUseCase: () => ({
      execute: (chatId: string, userId: string) =>
        chatUseCase.getLastMessageUseCase(chatId, userId),
    }),
    videoChatListUseCase: () => ({
      execute: (userId: string) => chatUseCase.videoChatListUseCase(userId),
    }),

    studentAssessmentsUseCase: () => ({
      execute: (userId: string, page: number, limit: number, search: string) =>
        examUseCase.studentAssessmentsUseCase(userId, page, limit, search),
    }),

    getQuestionsUseCase: () => ({
      execute: (assessmentId: string) =>
        examUseCase.getQuestionsUseCase(assessmentId),
    }),

    submitAssessmentUseCase: () => ({
      execute: (
        assessmentId: string,
        userId: string,
        answers: { answers: Answers[] }
      ) => examUseCase.submitAssessmentUseCase(assessmentId, userId, answers),
    }),

    certificateUseCase: () => ({
      execute: (assessmentId: string, userId: string) =>
        examUseCase.certificateUseCase(assessmentId, userId),
    }),

    //Notification UseCase
    assessmentNotificationUpdate: () => ({
      execute: (assessmentId: string) =>
        NotificationUseCase.assessmentNotificationUpdate(assessmentId),
    }),

    createAssessmentNotification: () => ({
      execute: (courseId: string) =>
        NotificationUseCase.createAssessmentNotification(courseId),
    }),

    getNotificationsUseCase: () => ({
      execute: (userId: string) =>
        NotificationUseCase.getNotificationsUseCase(userId),
    }),
  };
};
