import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { constant } from "../../../_lib/common/constant";

export class AdminUserController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // listing the students
  async getAdminStudentsList(req: Request, res: Response): Promise<void> {
    try {
      console.log('console userssssssssssssssssssssssssssssssssssss');
      
      const { getStudentsListUseCase } = this.dependencies.useCases;
      console.log(req.query, "_______________");
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      console.log(page, limit, "hdf");
      

      // const {page,limit,} = req.body
      const userList = await getStudentsListUseCase(
        this.dependencies
      ).execute(page,limit);
      console.log(userList,'{{{{{{{{{');
      
      res.status(httpStatusCode.OK).json({
        success: true,
        data: userList,
        message: "User logged in successfully",
      });
    } catch (error: any) {
      console.error("Error during getAdminStudentsList:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }
  // block unblock user
  async block_UnBlockUser(req: Request, res: Response): Promise<void> {
    const { blockUnblockUserUseCase } = this.dependencies.useCases;
    try {
      const { userId, isBlocked } = req.body;
      console.log("testing is under going");

      const statusChange = await blockUnblockUserUseCase(
        this.dependencies
      ).execute(userId, isBlocked);
      if (!statusChange) {
        return;
      }
      res.status(httpStatusCode.OK).json({
        success: true,
        message: "User status changed",
      });
    } catch (error: any) {
      console.error("Error during block unblock user:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }

  // user Details controller
  async userDetailsController(req: Request, res: Response): Promise<void> {
    const { userDetailsUseCase } = this.dependencies.useCases;
    try {
      console.log(req.params, "userDetails ");
      const { userId } = req.params;
      const userData = await userDetailsUseCase(this.dependencies).execute(
        userId
      );
      res.status(httpStatusCode.OK).json({
        success: true,
        message: "User status changed",
        data: userData,
      });
    } catch (error: constant) {
      console.error("Error in user Details :", error.message);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
      return;
    }
  }
  async transactionHistory(req: Request, res: Response): Promise<void> {
    const { transactionHistoryUseCase } = this.dependencies.useCases;
    try {
      const { page = "1", limit = "10" } = req.query;
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      console.log("Query params:", { page: pageNum, limit: limitNum, skip });

      const result = await transactionHistoryUseCase(this.dependencies).execute(
        skip,
        limitNum
      );

      if (!result || result.transactions.length === 0) {
        res.status(httpStatusCode.OK).json({
          success: true,
          message: "No transactions found",
          data: {
            transactions: [],
            totalPages: 0,
            currentPage: pageNum,
            totalTransactions: 0,
          },
        });
        return;
      }

      const { transactions, totalTransactions } = result;
      const totalPages = Math.ceil(totalTransactions / limitNum);

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Transactions fetched successfully",
        data: {
          transactions,
          totalPages,
          currentPage: pageNum,
          totalTransactions,
        },
      });
    } catch (error: any) {
      console.error("Error in transactionHistory:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}
