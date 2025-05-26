import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { Request, Response } from "express";

export class AdminInstructorController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  //  controller for listing instructor application
  async adminInstructorApplicationList(
    req: Request,
    res: Response
  ): Promise<void> {
    const { getInstructorApplicationUseCase } = this.dependencies.useCases;
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 2;
      const userList = await getInstructorApplicationUseCase(
        this.dependencies
      ).execute(page, limit);
      res.status(httpStatusCode.OK).json({
        success: true,
        data: userList,
        message: "Instructor application list",
      });
    } catch (error: any) {
      console.error("Error during getAdminStudentsList:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }

  //  controller for listing instructors
  async adminInstructorList(req: Request, res: Response): Promise<void> {
    const { getInstructorUseCase } = this.dependencies.useCases;
    try {
      console.log("getAdminStudentsList");
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 2;
      console.log(page, limit, "hdf");
      const userList = await getInstructorUseCase(this.dependencies).execute(
        page,
        limit
      );

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

  // status update for instructor applicant
  async updateInstructorStatus(req: Request, res: Response): Promise<void> {
    const { updateInstructorStatusUseCase } = this.dependencies.useCases;
    try {
      const { Id, status } = req.body;
      const update = await updateInstructorStatusUseCase(
        this.dependencies
      ).execute(Id, status);
      res.status(200).json({
        success: true,
        data: update,
        message: "status updated successfully",
      });
      return;
    } catch (error: constant) {
      console.error("Error during updateStatus:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }
}
