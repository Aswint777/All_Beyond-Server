import { matchOtpEntity, verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class OtpUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // ✅ Verify OTP
  async verifyOtpUseCase(otpData: verifyOtpEntity): Promise<verifyOtpEntity|null> {
    try {
      console.log("Executing verifyOtpUseCase");
      return await this.dependencies.repositories.verifyOtp(otpData);
    } catch (error: any) {
      console.error("Error in verifyOtpUseCase:", error);
      throw new Error(error?.message || "Error in OTP verification.");
    }
  }



  // ✅ Match OTP
  async otpMatchCheckingUseCase(data: matchOtpEntity): Promise<boolean|null> {
    try {
      console.log("Executing otpMatchCheckingUseCase with data:", data);
      const result = await this.dependencies.repositories.otpMatchChecking(data);
      if(!result){
        return false
      }
      return true
    } catch (error: any) {
      console.error("Error in otpMatchCheckingUseCase:", error);
      throw new Error(error?.message || "Error in OTP matching.");
    }
  }
    // ✅ Verify OTP as True
    async verifyOtpTrueUseCase(email: string): Promise<boolean|null> {
      try {
        console.log("Executing verifyOtpTrueUseCase");
        const result = await this.dependencies.repositories.verifyOtpTrue(email);
        if(!result){
          return false
        }
        return true
      } catch (error: any) {
        console.error("Error in verifyOtpTrueUseCase:", error);
        throw new Error(error?.message || "Error in OTP verification completion.");
      }
    }
}


///////////////////////////////////////////////////////////////////////////////////////////




// import { constant } from "../../../_lib/common/constant";
// import { matchOtpEntity, verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
// import { IDependencies } from "../../interfaces/IDependencies";


// export const verifyOtpUseCase = (dependencies : IDependencies) => {
//     console.log('console in the otp verify ');
    
//     const {repositories : {verifyOtp}} = dependencies
//     return {
//         execute : async(otpData:verifyOtpEntity) =>{
//             try {
//                 return await verifyOtp(otpData)
//             } catch (error:constant) {
//                 console.log('Error in otp verify ');
                
//                 throw new Error(error?.message || "Error in otp verify User");

//             }
//         }
//     }
// }




// export const verifyOtpTrueUseCase = (dependencies : IDependencies) => {
//     console.log('console in the otp verify true');
    
//     const {repositories : {verifyOtpTrue}} = dependencies
//     return {
//         execute : async(email:string) =>{
//             try {
                
//                 return await verifyOtpTrue(email)
//             } catch (error:constant) {
//                 console.log('Error in otp verify true');
                
//                 throw new Error(error?.message || "Error in otp verify User true");

//             }
//         }
//     }
// }



// export const otpMatchCheckingUseCase = (dependencies : IDependencies) => {
//     console.log('console in the match otp')
    
//     const {repositories : {otpMatchChecking}} = dependencies
//     return {
//         execute : async(data:matchOtpEntity) =>{
//             try {
//                 console.log(data,'lll');
                
//                 return await otpMatchChecking(data)
//             } catch (error:constant) {
//                 console.log('Error in match otp User');
                
//                 throw new Error(error?.message || "Error in match otp User");

//             }
//         }
//     }
// }