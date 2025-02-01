import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

export const instructorApplicationController = (dependencies: IDependencies) => {
    const { useCases } = dependencies;
    const {
      checkByEmailUseCase,

    } = useCases;
    return async (req: Request, res:Response,next:NextFunction) => {
        try {  
            console.log("instructorApplicationController................................................")
            console.log(req.body,',,,,');
            const {} = req.body
            
            const email = "hai"
            // const emailResult = await checkByEmailUseCase(dependencies).execute(email);
             res.status(httpStatusCode.CONFLICT).json({
                      success: true,
                      message: "this Email is already Logged , Try to Login ",
                    });
        } catch (error:constant) {
            next(error)
        }
    }

}
