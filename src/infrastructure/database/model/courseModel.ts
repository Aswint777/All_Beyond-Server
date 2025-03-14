import { Account } from "aws-sdk";
import { model, Schema, Types } from "mongoose";

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
  aboutInstructor: {
    type: String,
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
    enum: ["Premium", "Free"],
    default: "Free",
  },
  Price: {
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
});
export const Course = model("Course", courseSchema);
