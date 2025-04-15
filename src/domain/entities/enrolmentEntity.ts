import exp from "constants";
import { ObjectId } from "mongoose";

export interface EnrolmentEntity {
  _id?: string | ObjectId;
  courseId?:string|ObjectId
  userId?:string|ObjectId
}


export interface OverviewUserEntity {
  _id?: ObjectId;
  username?: string;
  email?: string;
  role?: "student" | "admin" | "instructor";
  createdAt?: Date;
  isBlocked?: boolean;
  [key: string]: any;
}

// paymentEntity.ts
export interface OverviewPaymentEntity {
  _id?: ObjectId;
  courseId?: ObjectId;
  userId?: ObjectId;
  amount?: number;
  instructorShare?: number;
  adminShare?: number;
  createdAt?: Date;
}

// courseEntity.ts
export interface OverviewCourseEntity {
  _id?: ObjectId;
  courseTitle?: string;
  user?: ObjectId;
  isBlocked?: boolean;
}

// enrolmentEntity.ts
export interface OverviewEnrolmentEntity {
  _id?: ObjectId;
  courseId?: ObjectId;
  userId?: ObjectId;
  createdAt?: Date;
}

export interface MonthlySignup {
    month: string;
    users: number;
  }
  
 export interface CourseEnrollment {
    courseName: string;
    enrollments: number;
  }
  
  export interface DashboardData {
    totalUsers: number;
    totalRevenue: number;
    totalProfit: number;
    monthlySignups: MonthlySignup[];
    courseEnrollments: CourseEnrollment[];
  }
