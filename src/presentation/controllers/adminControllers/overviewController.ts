import { Request, Response } from "express";
import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { IDependencies } from "../../../application/interfaces/IDependencies";

export class OverviewController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // creating the category
  async dashboard(req: Request, res: Response): Promise<void> {
    const { dashboardUseCase } = this.dependencies.useCases;
    try {
      const result = await dashboardUseCase(this.dependencies).execute();
  
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