import { Types } from "mongoose";

export interface INotification {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  courseId?: Types.ObjectId;
  type: 'course_update' | 'assessment_added' | 'assessment_updated' | 'exam_added' | 'exam_updated' | 'exam_deleted' | 'chat_message' | 'general';
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Notify {
  courseId: Types.ObjectId;
  type:string
  message:string
  createdAt:Date
}
