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
}

export interface LeanEnrolment {
  _id: string;
  courseId: string;
  userId: { _id: string; username: string };
  mark: number[];
  passed: boolean;
  createdAt: Date;
}

export interface Question {
  courseId: string;
  question: string;
  options: string[];
  correctOption: number;
}

export interface AssessmentResult {
  studentName: string;
  marks: number;
  attempts: number;
  passed: boolean | undefined;
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