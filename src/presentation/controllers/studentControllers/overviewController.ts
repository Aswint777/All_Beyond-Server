import { Request, Response } from "express";
import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";

export class StudentOverviewController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async studentDashboard(req: Request, res: Response): Promise<void> {
    try {
      const user = getUserFromToken(req, res);
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized: User ID not found" });
        return;
      }
      const userId = user._id;

      const { studentDashboardUseCase } = this.dependencies.useCases;
      const dashboardData = await studentDashboardUseCase(this.dependencies).execute(userId);

      console.log("Dashboard data sent to frontend:", dashboardData);

      if (!dashboardData) {
        res.status(404).json({ success: false, message: "No dashboard data found" });
        return;
      }

      res.status(200).json({ success: true, data: dashboardData });
    } catch (error: any) {
      console.error("Error in studentDashboard controller:", error);
      res.status(500).json({
        success: false,
        message: error.message || "problem"
      });
    }
  }
}