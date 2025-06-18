import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { constant } from "../../../_lib/common/constant";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";

export class InstructorOverviewController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async instructorDashboard(req: Request, res: Response): Promise<void> {
    const { instructorDashboardUseCase } = this.dependencies.useCases;
    try {
      const user = getUserFromToken(req, res);
      if (!user) return;
      const userId = user._id;

      const result = await instructorDashboardUseCase(
        this.dependencies
      ).execute(userId);

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Dashboard data fetched successfully",
        data: result,
      });
    } catch (error: constant) {
      console.error("Error in dashboard:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  async instructorTransactions(req: Request, res: Response): Promise<void> {
    const { instructorTransactionsUseCase } = this.dependencies.useCases;
    try {
      const user = getUserFromToken(req, res);
      if (!user) return;
      const userId = user._id;
      const { page = "1", limit = "10" } = req.query;
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      console.log("Query params:", { page: pageNum, limit: limitNum, skip });

      const result = await instructorTransactionsUseCase(
        this.dependencies
      ).execute(userId,skip, limitNum);

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
