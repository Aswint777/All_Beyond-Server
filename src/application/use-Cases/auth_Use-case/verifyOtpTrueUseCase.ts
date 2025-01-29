import { constant } from "../../../_lib/common/constant";
import { generateUserID } from "../../../_lib/common/generateUserID";
import { verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { IDependencies } from "../../interfaces/IDependencies";


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