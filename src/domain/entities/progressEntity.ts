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
    video?: string; 
    videoUrl?: string; 
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

  