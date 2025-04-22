import { model, Schema, Types } from "mongoose";
import { ProgressEntity } from "../../../domain/entities/progressEntity";

const progressSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: [
      {
        type: Types.ObjectId,
        ref: "Course.content.lessons",
      },
    ],
    unlockedLessons: [
      {
        type: Types.ObjectId,
        ref: "Course.content.lessons",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Progress = model<ProgressEntity>("Progress", progressSchema);

