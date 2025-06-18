import { Request, Response } from "express";
import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";

export class AssessmentController {
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async assessmentCourses(req: Request, res: Response): Promise<void> {
    const { assessmentCoursesUseCase } = this.dependencies.useCases;
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

      console.log("Request params:", { userId, page, limit, search });

      const result = await assessmentCoursesUseCase(this.dependencies).execute(
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

      console.log("Response data:", {
        courses: result.courses.length,
        totalPages: result.totalPages,
      });

      res.status(httpStatusCode.OK).json({
        success: true,
        data: {
          courses: result.courses,
          totalPages: result.totalPages,
        },
      });
    } catch (error: constant) {
      console.error("Error in assessmentCourses:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async createAssessments(req: Request, res: Response): Promise<void> {
    const { createAssessmentsUseCase,createAssessmentNotification } = this.dependencies.useCases;
    try {
      const user = getUserFromToken(req, res);
      if (!user) {
        res
          .status(httpStatusCode.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }
      const userId = user._id;

      const data = req.body;

      const result = await createAssessmentsUseCase(this.dependencies).execute(
        data
      );
      const courseId = data.courseId
       await createAssessmentNotification(this.dependencies).execute(
        courseId
      );

      if (!result) {
        res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Failed Creating Assessment",
        });
        return;
      }

      res.status(httpStatusCode.OK).json({
        success: true,
        data: result,
      });
    } catch (error: constant) {
      console.error("Error in createAssessments:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getAssessment(req: Request, res: Response): Promise<void> {
    const { getAssessmentUseCase } = this.dependencies.useCases;
    try {
      const { assessmentId } = req.params;

      const result = await getAssessmentUseCase(this.dependencies).execute(
        assessmentId
      );

      if (!result) {
        res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Failed get Assessment",
        });
        return;
      }
      console.log(result);

      res.status(httpStatusCode.OK).json({
        success: true,
        data: result,
      });
    } catch (error: constant) {
      console.error("Error in createAssessments:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateAssessment(req: Request, res: Response): Promise<void> {
    const { updateAssessmentUseCase,assessmentNotificationUpdate } = this.dependencies.useCases;
    try {
      const { assessmentId } = req.params;
      console.log(req.body);
      const data = req.body

      const result = await updateAssessmentUseCase(this.dependencies).execute(
        assessmentId,
        data
      );

      if (!result) {
        res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Failed get Assessment",
        });
        return;
      }

      console.log(result);
      const notify = await assessmentNotificationUpdate(this.dependencies).execute(
        assessmentId
      );
      res.status(httpStatusCode.OK).json({
        success: true,
        data: result,
      });
    } catch (error: constant) {
      console.error("Error in createAssessments:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
