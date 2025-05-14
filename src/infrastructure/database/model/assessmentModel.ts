import { model, Schema, Types } from "mongoose";
import { AssessmentEntity } from "../../../domain/entities/assessmentEntity";

const assessmentSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
    },
    courseTitle: {
      type: String,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
        },
        correctOption: {
          type: Number, 
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Assessment = model<AssessmentEntity>("Assessment", assessmentSchema);
