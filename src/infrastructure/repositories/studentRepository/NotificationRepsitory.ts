import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { Notify } from "../../../domain/entities/notificationEntity";
import { Assessment, Course, Enrolment } from "../../database/model";
import { Notification } from "../../database/model/notificationModel";

export class NotificationRepository
  implements Pick<IRepositories, "assessmentNotificationUpdateRepo">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  async assessmentNotificationUpdateRepo(
    assessmentId: string
  ): Promise<boolean | null> {
    try {
      const courseDetails = await Assessment.findOne({ _id: assessmentId });
      const data = `The assessment for the course "${courseDetails?.courseTitle}" has been updated.`;
      await Notification.create({
        courseId: courseDetails?.courseId,
        type: "assessment_updated",
        message: data,
      });

      return true;
    } catch (error: any) {
      console.error("Error in studentDashboardRepository:", error);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async getNotificationsRepo(userId: string): Promise<Notify[] | null> {
    try {
      const enrolments = await Enrolment.find({ userId: userId });

      const courseIds = enrolments.map((enrol) => enrol.courseId);

      const notifications = await Notification.find({
        $or: [{ userId: userId }, { courseId: { $in: courseIds } }],
      }).sort({ createdAt: -1 });

      const result: Notify[] = notifications.map((n) => ({
        courseId: n.courseId!,
        type: n.type,
        message: n.message,
        createdAt: n.createdAt,
      }));

      return result;
    } catch (error: any) {
      console.error("Error in getNotificationsRepo:", error);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  
  async readAllNotificationsRepo(userId: string): Promise<boolean | null> {
    try {
      console.log(userId,'oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo');
      
    const result = await Notification.updateMany(
      {
        userId: userId,
        isRead: { $ne: userId } 
      },
      {
        $addToSet: { isRead: userId }
      }
    );

    console.log("Notifications marked as read:", result.modifiedCount);

    return true;
  } catch (error: any) {
    console.error("Error in readAllNotificationsRepo:", error);
    throw new Error(error.message || "An unexpected error occurred");
  }
  }

    async createAssessmentNotificationRepo(
    courseId: string
  ): Promise<boolean | null> {
    try {
      const courseDetails = await Course.findOne({ _id: courseId });
      const data = `The assessment for the course "${courseDetails?.courseTitle}" has been updated.`;
      await Notification.create({
        courseId: courseId,
        type: "assessment_added",
        message: data,
      });

      return true;
    } catch (error: any) {
      console.error("Error in studentDashboardRepository:", error);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}
