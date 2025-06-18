import mongoose, { Types } from "mongoose";
import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import {
  DashboardData,
  LeanEnrollment,
  StudentDashboardData,
  StudentEnrollment,
} from "../../../domain/entities/enrolmentEntity";
import {
  AverageReview,
  ReviewData,
} from "../../../domain/entities/overviewEntity";
import { Assessment, Course, Enrolment, Payment } from "../../database/model";
import { Review } from "../../database/model/reviewModel";
import { PopulatedTransaction, TransactionOutput } from "../../../domain/entities/paymentEntity";

export class OverViewRepository
  implements Pick<IRepositories, "studentDashboardRepository">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  async studentDashboardRepository(
    userId: string
  ): Promise<StudentDashboardData | null> {
    try {
      console.log("studentDashboardRepository called for userId:", userId);

      if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }

      const enrollmentsRaw = await Enrolment.find({
        userId: new Types.ObjectId(userId),
      })
        .populate({
          path: "courseId",
          select: "courseTitle price",
          model: Course,
        })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const enrollments = enrollmentsRaw as unknown as LeanEnrollment[];

      if (!enrollments || enrollments.length === 0) {
        return {
          totalCoursesEnrolled: 0,
          totalPaidCourses: 0,
          totalFreeCourses: 0,
          completedAssessments: 0,
          pendingAssessments: 0,
          recentEnrollments: [],
        };
      }

      const totalCoursesEnrolled = enrollments.length;

      const totalPaidCourses = enrollments.filter(
        (enrollment) =>
          enrollment.courseId &&
          typeof enrollment.courseId === "object" &&
          "price" in enrollment.courseId &&
          (enrollment.courseId as any).price > 0
      ).length;

      const totalFreeCourses = enrollments.filter(
        (enrollment) =>
          enrollment.courseId &&
          typeof enrollment.courseId === "object" &&
          "price" in enrollment.courseId &&
          (enrollment.courseId as any).price === 0
      ).length;

      const completedAssessments = enrollments.filter(
        (enrollment) => enrollment.passed === true
      ).length;

      const pendingAssessments = enrollments.filter(
        (enrollment) => enrollment.passed === false
      ).length;

      const recentEnrollments: StudentEnrollment[] = enrollments
        .slice(0, 5)
        .filter(
          (enrollment) =>
            enrollment.courseId !== null && enrollment.courseId !== undefined
        )
        .map((enrollment) => ({
          courseName: (enrollment.courseId as any).courseTitle,
          enrollmentDate: enrollment.createdAt.toString(),
          courseId: (enrollment.courseId as any)._id.toString(),
        }));

      console.log(
        totalCoursesEnrolled,
        totalPaidCourses,
        totalFreeCourses,
        completedAssessments,
        pendingAssessments,
        recentEnrollments
      );

      return {
        totalCoursesEnrolled,
        totalPaidCourses,
        totalFreeCourses,
        completedAssessments,
        pendingAssessments,
        recentEnrollments,
      };
    } catch (error: any) {
      console.error("Error in studentDashboardRepository:", error);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async addReviewRepository(data: ReviewData): Promise<ReviewData | null> {
    try {
      console.log("data");
      const duplicate = await Review.exists({
        courseId: new mongoose.Types.ObjectId(data.courseId),
        userId: new mongoose.Types.ObjectId(data.userId),
      });
      if (duplicate) {
        return null;
      }
      const courseReview = await Review.create(data);
      if (!courseReview) return null;
      return courseReview;
    } catch (error: constant) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async getReviewRepository(courseId: string): Promise<ReviewData[] | null> {
    try {
      console.log("data");

      const courseReview = await Review.find({ courseId: courseId });

      if (!courseReview) return null;
      return courseReview;
    } catch (error: constant) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async averageReviewRepository(
    courseId: string
  ): Promise<AverageReview | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new Error("Invalid course ID");
      }

      const result = await Review.aggregate([
        { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            average: { $avg: "$rating" },
          },
        },
      ]);

      if (!result || result.length === 0) {
        return null;
      }

      return {
        count: result[0].count,
        average: result[0].average ? Number(result[0].average.toFixed(1)) : 0,
      };
    } catch (error: any) {
      throw new Error(
        `Failed to fetch average review: ${
          error.message || "An unexpected error occurred"
        }`
      );
    }
  }

  async studentTransactionsRepo(
    userId:string,
    skip: number = 0,
    limit: number = 10
  ): Promise<{
    transactions: TransactionOutput[];
    totalTransactions: number;
  } | null> {
    try {

      const transactions = (await Payment.find({userId:userId})
        .sort({ createdAt: -1 })
        .populate({
          path: "userId",
          select: "username",
          match: { isBlocked: false },
        })
        .populate({
          path: "courseId",
          select: "courseTitle user",
          match: { isBlocked: false },
          populate: {
            path: "user",
            select: "username",
            match: { isBlocked: false },
          },
        })
        .skip(skip)
        .limit(limit)
        .lean()) as unknown as PopulatedTransaction[];

      const validTransactions: TransactionOutput[] = transactions
        .filter((t) => t.userId && t.courseId && t.courseId.user)
        .map((t) => ({
          _id: t._id.toString(),
          studentName: t.userId.username,
          instructorName: t.courseId.user.username,
          courseName: t.courseId.courseTitle,
          transactionDate: t.createdAt,
          instructorShare: t.instructorShare,
          adminShare: t.adminShare,
          amount: t.amount,
        }));

      const totalTransactions = await Payment.countDocuments();

      return { transactions: validTransactions, totalTransactions };
    } catch (error: any) {
      console.error("Error in transactionHistoryRepository:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}
