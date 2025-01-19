import { verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { otpVerify } from "../../database/model";
import { fail } from "assert";

export const otpMatchChecking =async(data:verifyOtpEntity) : Promise <boolean|null> =>{
   try {
    console.log('console on the match otp User repository');
    const newUser = {
        ...data
    }
    console.log(newUser,'new');
    
    
    const checkUser = await otpVerify.findOne({email:data.email})
    
    if(!checkUser){
        return false
    }else if(checkUser.otp === data.otp){
        console.log('log here ***'); 
        return true
    }else{
        return false
    }
   } catch (error : unknown) {
    if(error instanceof Error){
        throw error
    }
    throw new Error("An unexpected error is occurred")
   }
}