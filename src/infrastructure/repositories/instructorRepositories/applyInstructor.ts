import { Types } from "mongoose";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import {
  InstructorDashboardData,
  MonthlyEnrollments,
  MonthlySignup,
} from "../../../domain/entities/enrolmentEntity";
import { UserEntity } from "../../../domain/entities/User";
import { Course, Enrolment, Payment, User } from "../../database/model";
import { PopulatedTransaction, TransactionOutput } from "../../../domain/entities/paymentEntity";

export class ApplyInstructor
  implements Pick<IRepositories, "instructorApplication">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // apply for instructor
  async instructorApplication(data: UserEntity): Promise<boolean | null> {
    try {
      const applyOne = await User.findOneAndUpdate(
        { _id: data._id },
        {
          $set: {
            firstName: data.firstName,
            lastName: data.lastName,
            age: data.age,
            qualification: data.qualification,
            address: data.address,
            contactNumber: data.contactNumber,
            gender: data.gender,
            city: data.city,
            country: data.country,
            pinNumber: data.pinNumber,
            email: data.email,
            profilePhoto: data.profilePhoto,
            educationFile: data.educationFile,
            isAppliedInstructor: true,
          },
        },
        { upsert: true, new: true } 
      );
      if (!applyOne) {
        return false;
      }
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }

  async instructorDashboardRepository(
    userId: string
  ): Promise<InstructorDashboardData | null> {
    try {
      const courses = await Course.find({
        user: new Types.ObjectId(userId),
      }).select("_id");
      const courseIds = courses.map((course) => course._id);

      if (!courseIds.length) {
        console.log(`No courses found for instructor ${userId}`);
        return {
          totalUsers: 0,
          totalRevenue: 0,
          totalCourses: 0,
          monthlyEnrollments: [],
          courseEnrollments: [],
        };
      }

      const totalUsers = await Enrolment.countDocuments({
        courseId: { $in: courseIds },
      });

      const revenueResult = await Payment.aggregate([
        {
          $match: {
            courseId: { $in: courseIds },
          },
        },
        {
          $group: {
            _id: null,
            totalInstructorRevenue: { $sum: "$instructorShare" },
          },
        },
      ]);

      const totalRevenue = revenueResult[0]?.totalInstructorRevenue || 0;

      const totalCourses = await Course.countDocuments({
        user: new Types.ObjectId(userId),
      });

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);

      const enrollmentsByMonth = await Enrolment.aggregate([
        {
          $match: {
            courseId: { $in: courseIds },
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            enrollments: { $sum: 1 },
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

      const monthlyEnrollments: MonthlySignup[] = Array.from(
        { length: 6 },
        (_, i) => {
          const date = new Date();
          date.setMonth(sixMonthsAgo.getMonth() + i);
          const monthIndex = date.getMonth();
          const record = enrollmentsByMonth.find(
            (e) => e._id === monthIndex + 1
          );
          return {
            month: months[monthIndex],
            users: record ? record.enrollments : 0,
          };
        }
      );

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
        {
          $match: {
            "course.user": new Types.ObjectId(userId),
          },
        },
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
      ]);

      return {
        totalUsers,
        totalRevenue,
        totalCourses,
        monthlyEnrollments,
        courseEnrollments,
      };
    } catch (error: any) {
      console.error("Error in dashboardRepository:", error);
      throw new Error("An unexpected error occurred");
    }
  }

    async instructorTransactionsRepo(
      userId:string,
      skip: number = 0,
      limit: number = 10
    ): Promise<{ transactions: TransactionOutput[]; totalTransactions: number } | null> {
      try {
        const courses = await Course.find({user:userId})
 const courseIds = courses.map(course => course._id);

    const transactions = await Payment.find({
      courseId: { $in: courseIds }
    })
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
      .lean() as unknown as PopulatedTransaction[];

    
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
            amount : t.amount
          }));
    
        const totalTransactions = await Payment.countDocuments();
    
        return { transactions: validTransactions, totalTransactions };
      } catch (error: any) {
        console.error("Error in transactionHistoryRepository:", error);
        throw new Error("An unexpected error occurred");
      }
    }
}
