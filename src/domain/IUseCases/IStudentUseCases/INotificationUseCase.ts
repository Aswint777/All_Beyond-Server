import { Notify } from "../../entities/notificationEntity";

export interface IAssessmentNotificationUpdate {
  execute(assessmentId:string): Promise<boolean | null>;
}

export interface ICreateAssessmentNotification {
  execute(courseId :string): Promise<boolean | null>;
}


export interface IGetNotificationsUseCase {
  execute(userId:string): Promise<Notify[] | null>;
}