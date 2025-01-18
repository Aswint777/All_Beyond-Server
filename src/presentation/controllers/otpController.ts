import { Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../_lib/common/HttpStatusCode";

export const verifyOtpController = (dependencies : IDependencies) =>{
   const {useCases} = dependencies;
   const { checkByEmailUseCase,otpMatchCheckingUseCase,verifyOtpTrueUseCase } = useCases;

   return async (req: Request, res: Response) => {
     
   console.log('data is in the verifyOtpController');
     console.log(req.body);
     const {email,otp} = req.body
     const data = {
      email,
      otp
     }
   //   const emailResult = await checkByEmailUseCase(dependencies).execute(email)
     const emailResult = await otpMatchCheckingUseCase(dependencies).execute(data)
     console.log(emailResult,'emailResult');
     if(!emailResult){
        res.status(httpStatusCode.CONFLICT).json({
           success : false,
           message: "OTP is not matching, try again "
         })
         return 
      }
      const verifyOtpComplete = await verifyOtpTrueUseCase(dependencies).execute(email)
      console.log(verifyOtpComplete, "verifyOtp Complete");
   
   }
}
