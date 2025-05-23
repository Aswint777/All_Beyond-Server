import { Types } from "mongoose";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import {
  assessmentCourses,
  LeanCourse,
  LeanAssessment,
  LeanEnrolment,
  AssessmentEntity,
  QuestionEntity,
} from "../../../domain/entities/assessmentEntity";
import { Course, Enrolment, Assessment } from "../../database/model";

export class AssessmentRepository
  implements
    Pick<
      IRepositories,
      "assessmentCoursesRepository" | "createAssessmentsRepository"
    >
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  async assessmentCoursesRepository(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ courses: assessmentCourses[]; totalPages: number }> {
    try {
      const query = {
        user: new Types.ObjectId(userId),
        isBlocked: false,
        ...(search ? { courseTitle: { $regex: search, $options: "i" } } : {}),
      };

      console.log("Query:", query);

      const [courses, totalCourses] = await Promise.all([
        Course.find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
          .exec()
          .then((data) => data as unknown as LeanCourse[]),
        Course.countDocuments(query),
      ]);

      console.log("Courses:", courses.length, "Total Courses:", totalCourses);

      if (!courses.length) {
        return { courses: [], totalPages: 0 };
      }

      const totalPages = Math.ceil(totalCourses / limit);

      const courseIds = courses.map((course) => course._id);
      const assessments = await Assessment.find({
        courseId: { $in: courseIds },
      })
        .lean()
        .exec()
        .then((data) => data as unknown as LeanAssessment[]);

      const enrolments = await Enrolment.find({ courseId: { $in: courseIds } })
        .populate<{ userId: { _id: string; username: string } }>(
          "userId",
          "username"
        )
        .lean()
        .exec()
        .then((data) => data as unknown as LeanEnrolment[]);

      const formattedCourses: assessmentCourses[] = courses.map((course) => {
        const assessment = assessments.find(
          (a) => a.courseId.toString() === course._id.toString()
        );
        const courseEnrolments = enrolments.filter(
          (e) => e.courseId.toString() === course._id.toString()
        );

        return {
          id: course._id.toString(),
          title: course.courseTitle || "Untitled",
          assessment: assessment
            ? {
                id: assessment._id.toString(),
                courseId: assessment.courseId.toString(),
                questions: assessment.questions.map(
                  (q: LeanAssessment["questions"][number]) => ({
                    courseId: course._id.toString(),
                    question: q.question,
                    options: q.options,
                    correctOption: q.correctOption,
                  })
                ),
                createdAt: assessment.createdAt.toISOString(),
                results: courseEnrolments.map((enrolment: LeanEnrolment) => {
                  const markArray = Array.isArray(enrolment.mark)
                    ? enrolment.mark
                    : [];
                  return {
                    studentName: enrolment.userId?.username || "Unknown",
                    marks:
                      markArray.length > 0
                        ? markArray[markArray.length - 1]
                        : 0,
                    attempts: markArray.length,
                    passed: enrolment.passed || false,
                  };
                }),
              }
            : undefined,
        };
      });

      console.log("Formatted Courses:", formattedCourses.length);

      return { courses: formattedCourses, totalPages };
    } catch (error) {
      console.error("Error in assessmentCoursesRepository:", error);
      return { courses: [], totalPages: 0 };
    }
  }
  async createAssessmentsRepository(
    data: AssessmentEntity
  ): Promise<AssessmentEntity | null> {
    try {
      console.log(data, "here");

      const createOne = await Assessment.create(data);
      if (!createOne) return null;
      return createOne;
    } catch (error) {
      console.error("Error in create assessment:", error);
      return null;
    }
  }

  async getAssessmentRepository(
    assessmentId: string
  ): Promise<AssessmentEntity | null> {
    try {
      console.log(assessmentId, "here");

      const getAssessment = await Assessment.findOne({
        _id: new Types.ObjectId(assessmentId),
      });
      if (!getAssessment) return null;
      return getAssessment;
    } catch (error) {
      console.error("Error in create assessment:", error);
      return null;
    }
  }

  async updateAssessmentRepository(
    assessmentId: string,
    data: { questions: QuestionEntity[] }
  ): Promise<AssessmentEntity | null> {
    try {
      console.log(data,"ooooooooooo");
      
 const updatedAssessment = await Assessment.findByIdAndUpdate(
      new Types.ObjectId(assessmentId),
      { $set: { questions: data.questions } },
      { new: true } 
    );
      if (!updatedAssessment) return null;
      return updatedAssessment;

    } catch (error: any) {
      console.error(
        "Error in updateAssessmentRepository:",
        error.message,
        error.stack
      );
      throw error;
    }
  }
}
