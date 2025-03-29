import { Account } from "aws-sdk";
import { model, Schema, Types } from "mongoose";
import { CourseEntity } from "../../../domain/entities/courseEntity";

const courseSchema = new Schema({
  courseTitle: {
    type: String,
    required: true,
    unique: true,
  },
  courseDescription: {
    type: String,
  },
  categoryName: {
    type: Types.ObjectId,
    ref: "category",
  },
  instructor:{
    type:String
  },
  aboutInstructor: {
    type: String,
  },
  thumbnailUrl:{
    type:String
  },
  content: [
    {
      moduleTitle: {
        type: String,
        required: true,
      },
      lessons: [
        {
          lessonTitle: {
            type: String,
            required: true,
          },
          lessonDescription: {
            type: String,
          },
          video: {
            type: String,
          },
        },
      ],
    },
  ],
  pricingOption: {
    type:String,
    enum: ["Premium", "Free"],
    // default: "Free",
  },
  price: {
    type: Number,
  },
  accountNumber: {
    type: Number,
  },
  additionalEmail: {
    type: String,
  },
  additionalContactNumber: {
    type: String,
  },
  user:{
    type: Types.ObjectId,
    ref:"users"
  },
  isBlocked :{
    type:Boolean,
    default:false
  },
});
export const Course = model<CourseEntity>("Course", courseSchema);
