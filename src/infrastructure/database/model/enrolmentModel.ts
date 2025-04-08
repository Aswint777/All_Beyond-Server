import { model, Schema, Types } from "mongoose";
import { EnrolmentEntity } from "../../../domain/entities/enrolmentEntity";

const enrolmentSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
    },
    userId:{
        type: Types.ObjectId,
        ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

export const Enrolment = model<EnrolmentEntity>("Enrolment", enrolmentSchema);
