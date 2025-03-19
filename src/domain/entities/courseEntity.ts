import { ObjectId } from "mongoose";

export interface CourseEntity {
  _id?: string | ObjectId;
  courseTitle?: string;
  courseDescription?: string;
  categoryName?: ObjectId; 
  aboutInstructor?: string;
  content?: {
    moduleTitle?: string;
    lessons?: {
      lessonTitle?: string;
      lessonDescription?: string;
      video?: string;
    }[];
  }[];
  pricingOption?: "Premium" | "Free";
  price?: number;
  accountNumber?: number;
  additionalEmail?: string;
  additionalContactNumber?: string;
  user?:ObjectId
}
