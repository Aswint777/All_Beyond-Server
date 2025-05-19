import mongoose, { Types } from "mongoose";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import {
  AssessmentResponse,
  AssessmentDetails,
  AssessmentResult,
  LeanEnrolment,
  LeanAssessment,
  AssessmentEntity,
  ExamAssessment,
  Answers,
  ExamResult,
  CertificateDetails,
  LeanUser,
  // ExamAssessment,
} from "../../../domain/entities/assessmentEntity";
import { Assessment, Course, Enrolment, User } from "../../database/model";
import { constant } from "../../../_lib/common/constant";

export interface LeansEnrolment {
  _id: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  courseId: string | Types.ObjectId;
  mark?: number[];
  passed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ExamRepository
  implements Pick<IRepositories, "studentAssessmentsRepository">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async studentAssessmentsRepository(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<AssessmentResponse> {
    try {
      // Validate inputs
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }
      if (page < 1 || limit < 1) {
        throw new Error("Invalid pagination parameters");
      }

      // Find enrollments for the student

      const enrollments: LeansEnrolment[] = await Enrolment.find({
        userId: new Types.ObjectId(userId),
      })
        .sort({ createdAt: -1 })
        .lean<LeansEnrolment[]>()
        .exec();

      console.log("Enrollments:", enrollments);

      if (!enrollments.length) {
        return {
          assessments: [],
          totalPages: 0,
          currentPage: page,
          totalAssessments: 0,
        };
      }

      // Filter out enrollments with undefined courseId
      const validEnrollments = enrollments.filter((e) => e.courseId);
      const courseIds = validEnrollments.map((e) => e.courseId.toString());

      console.log("Course IDs:", courseIds);

      if (!courseIds.length) {
        return {
          assessments: [],
          totalPages: 0,
          currentPage: page,
          totalAssessments: 0,
        };
      }

      // Build query for assessments
      const assessmentQuery = {
        courseId: { $in: courseIds.map((id) => new Types.ObjectId(id)) },
        ...(search ? { courseTitle: { $regex: search, $options: "i" } } : {}),
      };

      // Fetch assessments and total count
      const [assessments, totalAssessments] = await Promise.all([
        Assessment.find(assessmentQuery)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
          .exec() as Promise<LeanAssessment[]>,
        Assessment.countDocuments(assessmentQuery),
      ]);

      console.log("Assessments:", assessments);

      if (!assessments.length) {
        return {
          assessments: [],
          totalPages: 0,
          currentPage: page,
          totalAssessments: 0,
        };
      }

      const totalPages = Math.ceil(totalAssessments / limit);

      // Format assessments
      const formattedAssessments: AssessmentDetails[] = assessments.map(
        (assessment) => {
          const enrollment = validEnrollments.find(
            (e) => e.courseId.toString() === assessment.courseId.toString()
          );

          const marks = enrollment?.mark?.length
            ? enrollment.mark[enrollment.mark.length - 1]
            : 0;
          const attempts = enrollment?.mark?.length || 0;
          const passed = enrollment?.passed ?? false;
          const status = enrollment?.passed ?? false;

          return {
            _id: assessment._id.toString(),
            courseId: assessment.courseId.toString(),
            courseTitle: assessment.courseTitle || "Untitled",
            results: [
              {
                marks,
                attempts,
                passed,
                status,
              },
            ],
            createdAt:
              assessment.createdAt?.toISOString() || new Date().toISOString(),
          };
        }
      );

      console.log(
        "Formatted Assessments:",
        formattedAssessments,
        "++++++++++++++++++++++++++++++++++"
      );

      return {
        assessments: formattedAssessments,
        totalPages,
        currentPage: page,
        totalAssessments,
      };
    } catch (error: any) {
      console.error(
        `Error in studentAssessmentsRepository for userId=${userId}, page=${page}, limit=${limit}, search=${search}:`,
        error.message,
        error.stack
      );
      throw error;
    }
  }

  async getQuestionsRepository(
    assessmentId: string
  ): Promise<ExamAssessment | null> {
    try {
      console.log("pppppppppppppppppppppppppppppppppppppppppppp", assessmentId);

      const exams = await Assessment.findOne({
        _id: new mongoose.Types.ObjectId(assessmentId),
      });
      if (!exams) return null;
      return exams;
    } catch (error: constant) {
      throw new Error("An unexpected error occurred");
    }
  }

  async submitAssessmentRepository(
    assessmentId: string,
    userId: string,
    answers: { answers: Answers[] }
  ): Promise<ExamResult | null> {
    try {
      // Debug input
      console.log("submitAssessmentRepository input:", {
        assessmentId,
        userId,
        answers,
      });

      // Extract the answers array
      const answerArray = answers.answers;

      // Validate inputs
      if (
        !Types.ObjectId.isValid(assessmentId) ||
        !Types.ObjectId.isValid(userId)
      ) {
        throw new Error("Invalid assessment ID or user ID");
      }
      if (!Array.isArray(answerArray) || answerArray.length === 0) {
        throw new Error("No answers provided");
      }

      console.log("After validation:", {
        assessmentId,
        userId,
        answers: answerArray,
      });

      // Fetch assessment
      const assessment = (await Assessment.findOne({
        _id: new Types.ObjectId(assessmentId),
      }).lean()) as AssessmentEntity;

      if (!assessment) {
        return null;
      }
      if (!assessment.questions?.length) {
        throw new Error("No questions found in assessment");
      }
      if (!assessment.courseId) {
        throw new Error("Assessment missing courseId");
      }

      // Validate answers
      if (answerArray.length !== assessment.questions.length) {
        throw new Error("Number of answers does not match number of questions");
      }
      const invalidAnswer = answerArray.find(
        (answer) =>
          answer.questionIndex < 0 ||
          answer.questionIndex >= assessment.questions.length ||
          answer.selectedOption < 1 ||
          answer.selectedOption >
            assessment.questions[answer.questionIndex].options.length
      );
      if (invalidAnswer) {
        throw new Error("Invalid answer data");
      }

      // Check correct answers
      const correctAnswers = answerArray.reduce((count, answer) => {
        const question = assessment.questions[answer.questionIndex];
        return (
          count + (answer.selectedOption === question.correctOption ? 1 : 0)
        );
      }, 0);

      // Calculate marks
      const totalQuestions = assessment.questions.length;
      const marks = (correctAnswers * 100) / totalQuestions;

      // Determine pass/fail status
      const passed = marks >= 60;
      const status = passed ? "passed" : "failed";

      // Update or create enrolment
      const enrolment = await Enrolment.findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
          courseId: assessment.courseId,
        },
        {
          $push: { mark: marks },
          $set: { passed },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      if (!enrolment) {
        throw new Error("Failed to update enrolment");
      }

      // Return result
      return {
        status,
        correctAnswers,
        marks,
      };
    } catch (error: any) {
      console.error(
        `Error in submitAssessmentRepository for assessmentId=${assessmentId}, userId=${userId}:`,
        error.message,
        error.stack,
        { answers }
      );
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async certificateRepository(
    assessmentId: string,
    userId: string
  ): Promise<CertificateDetails | null> {
    try {
      // Validate inputs
      if (
        !mongoose.Types.ObjectId.isValid(assessmentId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        throw new Error("Invalid assessment or user ID");
      }

      // Fetch assessment
      const assessment = await Assessment.findOne({
        _id: new mongoose.Types.ObjectId(assessmentId),
      }).lean();
      if (!assessment) {
        console.log(`Assessment not found for ID: ${assessmentId}`);
        return null;
      }

      // Fetch enrolment to get mark and verify passed status
      const enrolment = (await Enrolment.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        courseId: assessment.courseId,
      }).lean()) as unknown as LeanEnrolment;
      if (!enrolment || !enrolment.passed) {
        console.log(
          `Enrolment not found or not passed for user: ${userId}, course: ${assessment.courseId}`
        );
        return null;
      }

      // Fetch course for instructor name
      const course = await Course.findOne({
        _id: assessment.courseId,
      }).lean();

      const instructor = await User.findOne({_id:course?.user})
      console.log(instructor,'9ooo');
      
      if (!course) {
        console.log(`Course not found for ID: ${assessment.courseId}`);
        return null;
      }

      // Fetch user for student name
      const user = (await User.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      }).lean()) as unknown as LeanUser;
      // console.log(user,'uuuuuuuuuuuuuuuuuuuuuuu');
      
      if (!user) {
        console.log(`User not found for ID: ${userId}`);
        return null; 
      }

      // Construct CertificateDetails
      const certificate: CertificateDetails = {
        studentName: user.username,
        instructor: instructor?.username || "Unknown Instructor",
        courseTitle:
          assessment.courseTitle || course.courseTitle || "Untitled Course",
        mark: enrolment.mark?.length
          ? enrolment.mark[enrolment.mark.length - 1]
          : 0,
      };

      // console.log("Certificate Details:", certificate);
      return certificate;
    } catch (error: any) {
      console.error(
        `Error in certificateRepository for assessmentId=${assessmentId}, userId=${userId}:`,
        error.message,
        error.stack
      );
      throw new Error("An unexpected error occurred");
    }
  }
}
