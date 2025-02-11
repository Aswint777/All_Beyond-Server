import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { constant } from "../../../_lib/common/constant";

export const adminInstructorApplicationListController =(dependencies:IDependencies) =>{
    const {useCases} = dependencies
    const {getInstructorApplicationUseCase} = useCases
    return async(req:Request,res:Response) =>{
        try {
            console.log("getAdminStudentsList");
            const userList = await getInstructorApplicationUseCase(dependencies).execute()
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


export const updateInstructorStatusController =(dependencies:IDependencies)=>{
    const {useCases} = dependencies
    const {}= useCases
    return async(req:Request,res:Response)=>{
        try {
            console.log(req.body);
            
            const {}=req.body

        } catch (error:constant) {
            console.error("Error during updateStatus:", error.message);
            res.status(500).json({ error: "Internal server error. Please try again later." });
        }
    }
}

// complete the update instructor