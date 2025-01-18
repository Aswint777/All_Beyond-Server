import { constant } from "../../../_lib/common/constant";
import { verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { IDependencies } from "../../interfaces/IDependencies";


export const verifyOtpUseCase = (dependencies : IDependencies) => {
    console.log('console in the otp verify ');
    
    const {repositories : {verifyOtp}} = dependencies
    return {
        execute : async(otpData:verifyOtpEntity) =>{
            try {
                return await verifyOtp(otpData)
            } catch (error:constant) {
                console.log('Error in otp verify ');
                
                throw new Error(error?.message || "Error in otp verify User");

            }
        }
    }
}