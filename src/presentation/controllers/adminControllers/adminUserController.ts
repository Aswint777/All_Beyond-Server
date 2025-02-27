import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

export class AdminUserController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // listing the students
  async getAdminStudentsList(req: Request, res: Response): Promise<void> {
    try {
      const { getStudentsListUseCase } = this.dependencies.useCases;
      console.log("getAdminStudentsList");
      const userList = await getStudentsListUseCase(
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
  // block unblock user
  async block_UnBlockUser(req: Request, res: Response): Promise<void> {
    const { blockUnblockUserUseCase } = this.dependencies.useCases;
    try {
      console.log("block here", req.body);
      const { userId, isBlocked } = req.body;
      const statusChange = await blockUnblockUserUseCase(
        this.dependencies
      ).execute(userId, isBlocked);
      if (!statusChange) {
        return;
      }
      res.status(httpStatusCode.OK).json({
        success: true,
        message: "User status changed",
      });
    } catch (error: any) {
      console.error("Error during block unblock user:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }
}
