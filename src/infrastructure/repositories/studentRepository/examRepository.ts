import { Types } from "mongoose";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { AssessmentResponse, AssessmentDetails, AssessmentResult, LeanEnrolment, LeanAssessment } from "../../../domain/entities/assessmentEntity";
import { Assessment, Enrolment } from "../../database/model";

export class ExamRepository implements Pick<IRepositories, "studentAssessmentsRepository"> {
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

      // Find enrolments for the student
      const enrolments: LeanEnrolment[] = await Enrolment.find({
        userId: new Types.ObjectId(userId),
      })
        .lean()
        .exec()as unknown as LeanEnrolment[];

      if (!enrolments.length) {
        return {
          assessments: [],
          totalPages: 0,
          currentPage: page,
          totalAssessments: 0,
        };
      }

      // Filter out enrolments with undefined courseId
      const validEnrolments = enrolments.filter((e) => e.courseId);
      const courseIds = validEnrolments.map((e) => e.courseId);

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
        courseId: { $in: courseIds },
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
      const formattedAssessments: AssessmentDetails[] = assessments.map((assessment) => {
        const enrolment = validEnrolments.find(
          (e) => e.courseId === assessment.courseId
        );

        const marks = enrolment?.mark?.length
          ? enrolment.mark[enrolment.mark.length - 1]
          : 0;
        const attempts = enrolment?.mark?.length || 0;
        const passed = enrolment?.passed ?? false;

        return {
          _id: assessment._id,
          courseId: assessment.courseId,
          courseTitle: assessment.courseTitle || "Untitled",
          results: enrolment
            ? [
                {
                  marks,
                  attempts,
                  passed,
                },
              ]
            : [],
          createdAt: assessment.createdAt?.toISOString() || new Date().toISOString(),
        };
      });

      return {
        assessments: formattedAssessments,
        totalPages,
        currentPage: page,
        totalAssessments,
      };
    } catch (error: any) {
      console.error(`Error in studentAssessmentsRepository for userId=${userId}, page=${page}, limit=${limit}, search=${search}:`, error.message, error.stack);
      throw error;
    }
  }
}