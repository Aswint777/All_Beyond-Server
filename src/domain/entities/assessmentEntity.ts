import { Types } from "mongoose";

export interface QuestionEntity {
  question: string;
  options: string[];
  correctOption: number;
}

export interface AssessmentEntity {
  _id?: string;
  courseId: string;
  courseTitle?: string;
  questions: QuestionEntity[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LeanCourse {
  _id: string;
  courseTitle: string;
  user: string | Types.ObjectId;
  isBlocked: boolean;
}

export interface LeanAssessment {
  _id: string;
  courseId: string;
  courseTitle?: string;
  questions: {
    question: string;
    options: string[];
    correctOption: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}


export interface LeanEnrolment {
  _id: string;
  courseId: string;
  userId: string;
  mark: number[];
  passed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  courseId: string;
  question: string;
  options: string[];
  correctOption: number;
}



export interface assessmentCourses {
  id: string;
  title: string;
  assessment?: {
    id: string;
    courseId: string;
    questions: Question[];
    createdAt: string;
    results?: AssessmentResult[];
  };
}

export interface AssessmentResult {
  marks: number;
  attempts: number;
  passed: boolean 
}

export interface AssessmentDetails {
  _id?: string;
  courseId?: string;
  courseTitle?: string;
  results?: AssessmentResult[];
  createdAt?: string;
}

export interface AssessmentResponse {
  assessments: AssessmentDetails[];
  totalPages: number;
  currentPage: number;
  totalAssessments: number;
}