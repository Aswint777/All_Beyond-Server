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
        res.status(httpStatusCode.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
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

      console.log("Response data:", { courses: result.courses.length, totalPages: result.totalPages });

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
    const { createAssessmentsUseCase } = this.dependencies.useCases;
    try {
      
      const user = getUserFromToken(req, res);
      if (!user) {
        res.status(httpStatusCode.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
      }
      const userId = user._id;

      console.log("Request params:", { userId});
      const data = req.body
      console.log(data,'<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

      const result = await createAssessmentsUseCase(this.dependencies).execute(data);

      if (!result) {
        res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Failed Creating Assessment",
        });
        return;
      }


      res.status(httpStatusCode.OK).json({
        success: true,
        data: result
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