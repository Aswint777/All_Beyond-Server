import { constant } from "../../../_lib/common/constant";
import { matchOtpEntity, verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
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




export const verifyOtpTrueUseCase = (dependencies : IDependencies) => {
    console.log('console in the otp verify true');
    
    const {repositories : {verifyOtpTrue}} = dependencies
    return {
        execute : async(email:string) =>{
            try {
                
                return await verifyOtpTrue(email)
            } catch (error:constant) {
                console.log('Error in otp verify true');
                
                throw new Error(error?.message || "Error in otp verify User true");

            }
        }
    }
}



export const otpMatchCheckingUseCase = (dependencies : IDependencies) => {
    console.log('console in the match otp')
    
    const {repositories : {otpMatchChecking}} = dependencies
    return {
        execute : async(data:matchOtpEntity) =>{
            try {
                console.log(data,'lll');
                
                return await otpMatchChecking(data)
            } catch (error:constant) {
                console.log('Error in match otp User');
                
                throw new Error(error?.message || "Error in match otp User");

            }
        }
    }
}