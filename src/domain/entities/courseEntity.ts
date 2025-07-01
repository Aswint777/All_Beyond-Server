import { ObjectId } from "mongoose";

export interface CourseEntity {
  _id?: string | ObjectId;
  courseTitle?: string;
  courseDescription?: string;
  categoryName?: ObjectId; 
  instructor?:string
  aboutInstructor?: string;
  thumbnailUrl?:string
  content?: {
    //  _id?: string | ObjectId;
    moduleTitle?: string;
    lessons?: {
       _id?: string | ObjectId;
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
  isBlocked?:boolean
}


export interface CoursesResponse {
  courses: CourseEntity[];
  totalPages: number;
}