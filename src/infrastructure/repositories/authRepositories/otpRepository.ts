import { generateUserID } from "../../../_lib/common/generateUserID";
import { verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { otpVerify, User } from "../../database/model";
import { fail } from "assert";



export const verifyOtp =async(otpData:verifyOtpEntity) : Promise <verifyOtpEntity|null> =>{
    try {
     console.log('console on the otp repository');
     const newUserOtp = {
         ...otpData
     }
     console.log(newUserOtp,'.........................');
     const otpCreateNewUSer = await otpVerify.create(newUserOtp)
     console.log(otpCreateNewUSer," result form repo otp")
     if(otpCreateNewUSer){
         return otpCreateNewUSer 
     }
     return null
    } catch (error : unknown) {
     if(error instanceof Error){
         throw error
     }
     throw new Error("An unexpected error is occurred")
    }
 }
 
 // check the otp scema and delete the user name and do the resend otp



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



export const verifyOtpTrue =async(email:string) : Promise <boolean|null> =>{
   try { 
    const userId = generateUserID()
    console.log();
    const checkUser = await User.findOneAndUpdate({email:email},{isVerified :true,userId:userId })
     return true
   } catch (error : unknown) {
    if(error instanceof Error){
        throw error
    }
    throw new Error("An unexpected error is occurred")
   }
}