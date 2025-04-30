import exp from "constants";
import mongoose, { ObjectId } from "mongoose";

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


  export interface LessonOutput {
    lessonTitle: string;
    lessonDescription?: string;
    videoUrl?: string;
    thumbnailUrl?: string;

  }
  
  export interface ModuleOutput {
    moduleTitle: string;
    lessons: LessonOutput[];
  }

  interface LessonDocument {
    lessonTitle: string;
    lessonDescription?: string;
    video?: string;
    thumbnailUrl?: string;
  }
  
interface ModuleDocument {
  moduleTitle: string;
  lessons: LessonDocument[];
}

  export interface CourseOutput {
    _id: string;
    courseTitle: string;
    courseDescription?: string;
    instructorName: string;
    aboutInstructor?: string;
    thumbnailUrl?: string;
    pricingOption?: "Premium" | "Free";
    price?: number;
    content: ModuleOutput[];
    isEnrolled: boolean;
  }

  export interface CourseDocument {
    _id: mongoose.Types.ObjectId;
    courseTitle: string;
    courseDescription?: string;
    instructor?: string;
    user?: { username: string };
    aboutInstructor?: string;
    thumbnailUrl?: string;
    pricingOption?: "Premium" | "Free";
    price?: number;
    content: ModuleDocument[];
    isBlocked: boolean;
  }


  export interface MonthlyEnrollments {
    month: string;
    users: number;
  }
  
//  export interface CourseEnrollment {
//     courseName: string;
//     enrollments: number;
//   }
  
  export interface InstructorDashboardData {
    totalUsers: number;
    totalRevenue: number;
    totalCourses: number;
    monthlyEnrollments: MonthlyEnrollments[];
    courseEnrollments: CourseEnrollment[];
  }

  export interface StudentDashboardData {
    totalCoursesEnrolled: number;
    enrolledCourses: { courseName: string; count: number }[];
    recentEnrollments: StudentEnrollment[];
  }
  
  export interface StudentEnrollment {
    courseName: string;
    enrollmentDate: string;
    courseId: string;
  }
  
  // Type for lean enrollment document after population
  export interface LeanEnrollment {
    _id: string;
    courseId: { _id: string; courseTitle: string } | null; // Populated course, null if not found
    userId: string;
    createdAt: string; // ISO string from lean()
  }