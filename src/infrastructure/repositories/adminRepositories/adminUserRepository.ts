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
  async getStudentsList(page:number, limit:number): Promise<{ data: UserEntity[], total: number, currentPage: number, totalPages: number } | boolean |null> {
    try {
      console.log("console on the check by email repository",page, limit);
    const query = { isVerified: true, role: "student" };
    const skip = (page - 1) * limit;
console.log(query);

    const total = await User.countDocuments(query);
    console.log(total);
    
    const studentsList = await User.find(query)
      .skip(skip)
      .limit(limit)
console.log(studentsList);

    if (studentsList.length > 0) {
      return {
        data: studentsList,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
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
      const transactions = await Payment.find().sort({createdAt:-1})
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
