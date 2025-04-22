import { ObjectId, Types } from "mongoose";

export interface ProgressEntity {
    _id?: string | Types.ObjectId;
    courseId: string | Types.ObjectId;
    userId: string | Types.ObjectId;
    percentage: number;
    completedLessons: (string | Types.ObjectId)[];
    unlockedLessons: (string | Types.ObjectId)[];
  }