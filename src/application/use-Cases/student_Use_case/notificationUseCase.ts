import { constant } from "../../../_lib/common/constant";
import { Notify } from "../../../domain/entities/notificationEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class NotificationUsCase  {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async getNotificationsUseCase(userId:string): Promise<Notify[]| null> {
  const { getNotificationsRepo } = this.dependencies.repositories;
  try {
    return await getNotificationsRepo(userId);

  } catch (error: constant) {
    console.error("Error in getNotificationsUseCase:", error);
    throw new Error(
      "An unexpected error occurred: " + (error.message || "Unknown error")
    );
  }
}
  async assessmentNotificationUpdate(assessmentId:string): Promise<boolean| null> {
    const { assessmentNotificationUpdateRepo } = this.dependencies.repositories;
    try {
      return await assessmentNotificationUpdateRepo(assessmentId);

    } catch (error: constant) {
      console.error("Error in assessmentNotificationUpdate:", error);
      throw new Error(
        "An unexpected error occurred: " + (error.message || "Unknown error")
      );
    }
  }

    async createAssessmentNotification(courseId:string): Promise<boolean| null> {
    const { createAssessmentNotificationRepo } = this.dependencies.repositories;
    try {
      return await createAssessmentNotificationRepo(courseId);

    } catch (error: constant) {
      console.error("Error in assessmentNotification create:", error);
      throw new Error(
        "An unexpected error occurred: " + (error.message || "Unknown error")
      );
    }
  }
}
