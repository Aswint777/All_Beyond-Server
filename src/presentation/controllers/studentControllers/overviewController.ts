import { Request, Response } from "express";
import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

export class StudentOverviewController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async studentDashboard(req: Request, res: Response): Promise<void> {
    try {
      const user = getUserFromToken(req, res);
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: "Unauthorized: User ID not found" });
        return;
      }
      const userId = user._id;

      const { studentDashboardUseCase } = this.dependencies.useCases;
      const dashboardData = await studentDashboardUseCase(
        this.dependencies
      ).execute(userId);

      console.log("Dashboard data sent to frontend:", dashboardData);

      if (!dashboardData) {
        res
          .status(404)
          .json({ success: false, message: "No dashboard data found" });
        return;
      }

      res.status(200).json({ success: true, data: dashboardData });
    } catch (error: constant) {
      console.error("Error in studentDashboard controller:", error);
      res.status(500).json({
        success: false,
        message: error.message || "problem",
      });
    }
  }

  async addReview(req: Request, res: Response): Promise<void> {
    try {
      const { addReviewUseCase } = this.dependencies.useCases;
      const user = getUserFromToken(req, res);
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: "Unauthorized: User ID not found" });
        return;
      }
      const userId = user._id;
      const { rating, comment } = req.body;
      const { courseId } = req.params;

      const data = {
        userId: userId,
        courseId: courseId,
        rating: rating,
        comment: comment,
      };
      const courseReview = await addReviewUseCase(this.dependencies).execute(
        data
      );
      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Review added successfully",
        data: courseReview,
      });
    } catch (error: constant) {
      res.status(500).json({
        success: false,
        message: error.message || "problem",
      });
    }
  }
  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const { getReviewUseCase } = this.dependencies.useCases;
      const { courseId } = req.params;
      const courseReview = await getReviewUseCase(this.dependencies).execute(
        courseId
      );
      if (!courseReview) {
        res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "You have already submitted a review for this course",
        });
        return;
      }
      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Review added successfully",
        data: courseReview,
      });
    } catch (error: constant) {
      res.status(500).json({
        success: false,
        message: error.message || "problem",
      });
    }
  }

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { getNotificationsUseCase } = this.dependencies.useCases;
      const user = getUserFromToken(req, res);
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const userId = user._id;
      console.log(
        "<>>>>>>>>>>>>>>>>>>>>>>ssssssssssssssssssssstttttttssssssdsjcvdkfdlfkzs;dli"
      );
      const result = await getNotificationsUseCase(this.dependencies).execute(
        userId
      );

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Notification successfully",
        data: result,
      });
    } catch (error: constant) {
      res.status(500).json({
        success: false,
        message: error.message || "problem",
      });
    }
  }
}
