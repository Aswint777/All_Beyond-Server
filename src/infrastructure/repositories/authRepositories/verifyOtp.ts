import { verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { otpVerify } from "../../database/model";

export const verifyOtp =async(otpData:verifyOtpEntity) : Promise <verifyOtpEntity|null> =>{
   try {
    console.log('console on the otp repository');
    const newUserOtp = {
        ...otpData
    }
    console.log(newUserOtp);
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