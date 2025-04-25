import { ObjectId, Types } from "mongoose";

export interface ProgressEntity {
    _id?: string | Types.ObjectId;
    courseId: string | Types.ObjectId;
    userId: string | Types.ObjectId;
    percentage: number;
    completedLessons: (string | Types.ObjectId)[];
    unlockedLessons: (string | Types.ObjectId)[];
  }


  export interface LessonLean {
    _id: Types.ObjectId;
    lessonTitle: string;
    lessonDescription?: string;
    video?: string; // For backward compatibility
    videoUrl?: string; // For frontend
    thumbnailUrl?: string;
  }
  
  export interface ModuleLean {
    moduleTitle: string;
    lessons: LessonLean[];
  }
  
  export interface CourseLean {
    _id: Types.ObjectId;
    courseTitle: string;
    courseDescription?: string;
    categoryName?: Types.ObjectId;
    instructor?: string;
    instructorName?: string; // Added for frontend
    aboutInstructor?: string;
    thumbnailUrl?: string;
    pricingOption?: "Premium" | "Free";
    price?: number;
    accountNumber?: number;
    additionalEmail?: string;
    additionalContactNumber?: string;
    content: ModuleLean[];
    user?: Types.ObjectId;
    isBlocked: boolean;
    isEnrolled?: boolean;
  }

  
  

  // export interface LessonLean {
  //   _id: Types.ObjectId;
  //   lessonTitle: string;
  //   lessonDescription?: string;
  //   video?: string;
  //   thumbnailUrl?: string;
  // }
  
  // // Interface for a module (used in CourseLean)
  // export interface ModuleLean {
  //   moduleTitle: string;
  //   lessons: LessonLean[];
  // }
  
  // // Interface for the Course document (lean version)
  // export interface CourseLean {
  //   _id: Types.ObjectId;
  //   courseTitle: string;
  //   courseDescription?: string;
  //   instructor?: string;
  //   aboutInstructor?: string;
  //   thumbnailUrl?: string;
  //   pricingOption?: "Premium" | "Free";
  //   price?: number;
  //   content: ModuleLean[];
  //   user?: { username: string };
  //   isBlocked: boolean;
  // }