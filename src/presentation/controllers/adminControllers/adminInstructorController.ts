import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { Request, Response } from "express";

export class AdminInstructorController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // ✅ Sign Up Method
  async adminInstructorApplicationList(
    req: Request,
    res: Response
  ): Promise<void> {
    const { getInstructorApplicationUseCase } = this.dependencies.useCases;
    try {
      console.log("getAdminStudentsList");
      const userList = await getInstructorApplicationUseCase(
        this.dependencies
      ).execute();
      console.log(userList, "list");
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
      // console.log(req.body);
      const { Id, status } = req.body;
      // console.log(Id);

      const update = await updateInstructorStatusUseCase(this.dependencies).execute(
        Id,
        status
      )
      // console.log(update, "jjj");
      res.status(200).json({
        success: true,
        data: update,
        message: "status updated successfully",
      });
      return
    } catch (error: constant) {
      console.error("Error during updateStatus:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }
}
