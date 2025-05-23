import { Certificate } from "crypto";
import { Types } from "mongoose";

export interface QuestionEntity {
  _id?: string;
  question: string;
  options: string[];
  correctOption: number;
}

export interface AssessmentEntity {
  _id?: string;
  courseId?: string;
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
  courseId: string 
  userId: { _id: string; username: string };
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
  studentName?: string;

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


export interface ExamQuestion {
  question: string;
  options: string[];
}

export interface ExamAssessment {
  _id?: string;
  courseId?: string;
  courseTitle?: string;
  questions?: ExamQuestion[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Answers {
  questionIndex:number
  selectedOption:number
}


export interface ExamResult {
  status: "passed" | "failed";
  correctAnswers: number;
  marks: number;
}


export interface CertificateDetails {
  studentName : string
  instructor : string 
  courseTitle : string 
  mark:number
}

export interface LeanUser {
  _id?: string | Types.ObjectId;
  username: string;
  email?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}