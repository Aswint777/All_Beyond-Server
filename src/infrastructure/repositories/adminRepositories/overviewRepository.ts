import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { DashboardData, MonthlySignup } from "../../../domain/entities/enrolmentEntity";
import { Enrolment, Payment, User } from "../../database/model";

export class OverViewRepository
  implements Pick <IRepositories,'dashboardRepository'>
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  async dashboardRepository(): Promise<DashboardData|null> {
    try {
      const totalUsers = await User.countDocuments({ isBlocked: false });
  
      const revenueResult = await Payment.aggregate([
        { $match: { amount: { $ne: null } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
          },
        },
      ]);
      const totalRevenue = revenueResult[0]?.totalRevenue || 0;
  
      const profitResult = await Payment.aggregate([
        { $match: { adminShare: { $ne: null } } },
        {
          $group: {
            _id: null,
            totalProfit: { $sum: "$adminShare" },
          },
        },
      ]);
      const totalProfit = profitResult[0]?.totalProfit || 0;
  
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
      const userSignups = await User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, isBlocked: false } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            users: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
  
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthlySignups: MonthlySignup[] = Array.from({ length: 6 }, (_, i) => {
        const monthIndex = (sixMonthsAgo.getMonth() + i) % 12;
        const signup = userSignups.find((s) => s._id === (monthIndex + 1));
        return {
          month: months[monthIndex],
          users: signup ? signup.users : 0,
        };
      });
  
      const courseEnrollments = await Enrolment.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        { $unwind: "$course" },
        { $match: { "course.isBlocked": false } },
        {
          $group: {
            _id: "$course._id",
            courseName: { $first: "$course.courseTitle" },
            enrollments: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            courseName: 1,
            enrollments: 1,
          },
        },
        { $sort: { enrollments: -1 } },
        { $limit: 5 }, 
      ]);
  
      return {
        totalUsers,
        totalRevenue,
        totalProfit,
        monthlySignups,
        courseEnrollments,
      };
    } catch (error: any) {
      console.error("Error in dashboardRepository:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}