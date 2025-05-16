import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { constant } from "../../../_lib/common/constant";


export class ExamController {
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async studentAssessments(req: Request, res: Response): Promise<void> {
    const { studentAssessmentsUseCase } = this.dependencies.useCases;
    try {
      
      const user = getUserFromToken(req, res);
      if (!user) {
        res
          .status(httpStatusCode.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }
      const userId = user._id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";

      console.log("Request params:mmmmmm", { userId, page, limit, search });

      const result = await studentAssessmentsUseCase(this.dependencies).execute(
        userId,
        page,
        limit,
        search
      );

      if (!result) {
        res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "No courses found",
        });
        return;
      }

      console.log("Response data:");

      res.status(httpStatusCode.OK).json({
        success: true,
        data: result
      });
    } catch (error: constant) {
      console.error("Error in assessmentCourses:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}