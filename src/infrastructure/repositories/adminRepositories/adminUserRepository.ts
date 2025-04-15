import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { PopulatedTransaction, TransactionOutput } from "../../../domain/entities/paymentEntity";
import { UserEntity } from "../../../domain/entities/User";
import { Payment, User } from "../../database/model";


export class AdminUserRepository
  implements Pick<IRepositories, "getStudentsList" | "block_UnBlockUser">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  //listing the students
  async getStudentsList(): Promise<UserEntity[] | boolean | null> {
    try {
      console.log("console on the check by email repository");

      const studentsList = await User.find({
        isVerified: true,
        role: "student",
      });
      console.log(studentsList, " result form getStudentsList repo");
      if (studentsList) {
        return studentsList;
      }
      return false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }

  //  blocking the users
  async block_UnBlockUser(
    userId: string,
    isBlocked: boolean
  ): Promise<boolean | null> {
    try {
      console.log(userId, isBlocked, "is blocked or userId");

      const statusChange = await User.findOneAndUpdate(
        { userId: userId },
        { isBlocked: isBlocked }
      );
      if (statusChange) {
        return true;
      }
      return false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }

  async findByUserId(userId:string):Promise<UserEntity|null>{
    try {
      return await User.findOne({userId:userId})
    } catch (error:constant) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }
  async transactionHistoryRepository(
    skip: number = 0,
    limit: number = 10
  ): Promise<{ transactions: TransactionOutput[]; totalTransactions: number } | null> {
    try {
      // Fetch payments with pagination
      const transactions = await Payment.find()
        .populate({
          path: "userId",
          select: "username", // Student name
          match: { isBlocked: false }, // Only unblocked students
        })
        .populate({
          path: "courseId",
          select: "courseTitle user",
          match: { isBlocked: false }, // Only unblocked courses
          populate: {
            path: "user",
            select: "username", // Instructor name
            match: { isBlocked: false }, // Only unblocked instructors
          },
        })
        .skip(skip)
        .limit(limit)
        .lean() as unknown as PopulatedTransaction[];
  
      // Filter out invalid transactions and map to output format
      const validTransactions: TransactionOutput[] = transactions
        .filter((t) => t.userId && t.courseId && t.courseId.user) // Ensure all required fields exist
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
  
      // Get total count
      const totalTransactions = await Payment.countDocuments();
  
      console.log("📌Repository result 📌 :", { transactions: validTransactions, totalTransactions });
  
      return { transactions: validTransactions, totalTransactions };
    } catch (error: any) {
      console.error("Error in transactionHistoryRepository:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}
