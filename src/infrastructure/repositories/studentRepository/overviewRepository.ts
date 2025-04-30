import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { DashboardData, LeanEnrollment, StudentDashboardData } from "../../../domain/entities/enrolmentEntity";
import { Course, Enrolment } from "../../database/model";

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
      } catch (error) {
        console.error("Error in studentDashboardRepository:", error);
        return null;
      }
    }

    
}