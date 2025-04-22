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
      console.log("-----------------------------instructorDashboard---------------------------------------");
      
            const user = getUserFromToken(req, res);
            if (!user) return;
            const userId = user._id;
      
      const result = await instructorDashboardUseCase(this.dependencies).execute(userId);
  
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
  }}