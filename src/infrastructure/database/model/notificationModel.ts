import { Schema, model, Types } from "mongoose";
import { INotification } from "../../../domain/entities/notificationEntity";

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Courses",
    },
    type: {
      type: String,
      enum: [
        "course_update",
        "assessment_added",
        "assessment_updated",
        "exam_added",
        "exam_updated",
        "exam_deleted",
        "chat_message",
        "general",
      ],
    },
    message: {
      type: String,
    },
    isRead: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
