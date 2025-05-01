import mongoose from "mongoose";
import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { DashboardData, LeanEnrollment, StudentDashboardData } from "../../../domain/entities/enrolmentEntity";
import { AverageReview, ReviewData } from "../../../domain/entities/overviewEntity";
import { Course, Enrolment } from "../../database/model";
import { Review } from "../../database/model/reviewModel";

export class OverViewRepository
  implements Pick <IRepositories,'studentDashboardRepository'>
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  async studentDashboardRepository(userId: string): Promise<StudentDashboardData | null> {
    try {
        console.log("studentDashboardRepository called for userId:", userId);
  
        // Fetch enrollments with lean()
        const enrollmentsRaw = await Enrolment.find({ userId })
          .populate({
            path: "courseId",
            select: "courseTitle",
            model: Course,
          })
          .sort({ createdAt: -1 }) // Most recent first
          .lean()
          .exec();
  
        // Cast to LeanEnrollment[] safely
        const enrollments = enrollmentsRaw as unknown as LeanEnrollment[];
  
        // If no enrollments, return empty data
        if (!enrollments || enrollments.length === 0) {
          return {
            totalCoursesEnrolled: 0,
            enrolledCourses: [],
            recentEnrollments: [],
          };
        }
  
        // Aggregate data
        const totalCoursesEnrolled = enrollments.length;
  
        // Map enrolled courses for bar chart
        const enrolledCourses = enrollments
          .filter((enrollment) => enrollment.courseId !== null && enrollment.courseId !== undefined) // Ensure courseId exists
          .map((enrollment) => ({
            courseName: enrollment.courseId!.courseTitle,
            count: 1, // One enrollment per course
          }));
  
        // Map recent enrollments (up to 5) for table
        const recentEnrollments = enrollments
          .slice(0, 5)
          .filter((enrollment) => enrollment.courseId !== null && enrollment.courseId !== undefined) // Ensure courseId exists
          .map((enrollment) => ({
            courseName: enrollment.courseId!.courseTitle,
            enrollmentDate: enrollment.createdAt,
            courseId: enrollment.courseId!._id,
          }));
  
        return {
          totalCoursesEnrolled,
          enrolledCourses,
          recentEnrollments,
        };
      } catch (error:constant) {
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
              if(duplicate){
                return null
              }
        const courseReview = await Review.create(data)
        if(!courseReview) return null
        return courseReview
      } catch (error:constant) {
        throw new Error(error.message || "An unexpected error occurred");    

      }
    }

    async getReviewRepository(courseId:string): Promise<ReviewData[] | null> {
      try {
        console.log("data");
        
        const courseReview = await Review.find({courseId:courseId})
        
        if(!courseReview) return null
        return courseReview
      } catch (error:constant) {
        throw new Error(error.message || "An unexpected error occurred");    

      }
    }

    async averageReviewRepository(courseId:string): Promise<AverageReview| null> {
      try {
        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
          throw new Error("Invalid course ID");
        }
    
        // Aggregate to calculate count and average rating
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
    
        // If no reviews found, return null
        if (!result || result.length === 0) {
          return null;
        }
    
        // Return the count and average
        return {
          count: result[0].count,
          average: result[0].average ? Number(result[0].average.toFixed(1)) : 0, // Round to 1 decimal
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch average review: ${error.message || "An unexpected error occurred"}`);
      }
    }
}