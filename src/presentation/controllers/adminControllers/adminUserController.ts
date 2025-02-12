import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";



export const getAdminStudentsListController =(dependencies:IDependencies) =>{
    const {useCases} = dependencies
    const {getStudentsListUseCase} = useCases
    return async(req:Request,res:Response) =>{
        try {
            console.log("getAdminStudentsList");
            const userList = await getStudentsListUseCase(dependencies).execute()
            console.log(userList,'list');
              res.status(httpStatusCode.OK).json({
                success: true,
                data: userList,
                message: "User logged in successfully",
              });

        } catch (error:any) {
            console.error("Error during getAdminStudentsList:", error.message);
            res.status(500).json({ error: "Internal server error. Please try again later." });
        }
    }
}

export const block_UnBlockUserController = (dependencies: IDependencies) => {
  const { useCases } = dependencies;
  const { block_UnBlockUserUseCase } = useCases;
  return async (req: Request, res: Response) => {
    try {
      console.log("block here", req.body);
      const { userId, isBlocked } = req.body;
      const statusChange = await block_UnBlockUserUseCase(dependencies).execute(
        userId,
        isBlocked
      );
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
  };
};


