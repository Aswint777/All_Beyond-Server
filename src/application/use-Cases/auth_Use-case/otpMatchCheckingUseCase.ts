import { constant } from "../../../_lib/common/constant";
import { UserEntity } from "../../../domain/entities/User";
import { matchOtpEntity, verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { IDependencies } from "../../interfaces/IDependencies";


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