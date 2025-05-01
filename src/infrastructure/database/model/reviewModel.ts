import { model, Schema, Types } from "mongoose";
import { ReviewData } from "../../../domain/entities/overviewEntity";

const reviewSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
    },
    userId:{
        type: Types.ObjectId,
        ref: "users",
    },
    rating:{
        type:Number
    },
    comment:{
        type:String
    }
  },
  {
    timestamps: true,
  }
);

export const Review = model<ReviewData>("Review", reviewSchema);


  