import { generateUserID } from "../../../_lib/common/generateUserID";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { matchOtpEntity, verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { otpVerify, User } from "../../database/model";

export class OtpRepository implements Pick<IRepositories, "verifyOtp"|"otpMatchChecking" > {
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  async verifyOtp(otpData: verifyOtpEntity): Promise<verifyOtpEntity | null> {
    try {
      console.log("Executing verifyOtp in OtpRepository...");
      console.log("Incoming OTP Data:", otpData);

      const otpCreateNewUser = await otpVerify.create({ ...otpData });
      console.log("OTP Verification Result:", otpCreateNewUser);

      return otpCreateNewUser || null;
    } catch (error: unknown) {
      console.error("Error in verifyOtp:", error);
      throw new Error("An unexpected error occurred during OTP verification.");
    }
  }

  // ✅ Check OTP Matching
  async otpMatchChecking(data: matchOtpEntity): Promise<boolean | null> {
    try {
      console.log("Executing otpMatchChecking in OtpRepository...");
      console.log("Incoming Data:", data);

      const checkUser = await otpVerify.findOne({ email: data.email });

      if (!checkUser) {
        return false;
      }
      return checkUser.otp === data.otp; // Returns true if OTP matches, false otherwise


    } catch (error: unknown) {
      console.error("Error in otpMatchChecking:", error);
      return null
    }
  }

  // ✅ Verify OTP as True (User Verification)
  async verifyOtpTrue(email: string): Promise<boolean | null> {
    try {
      console.log("Executing verifyOtpTrue in OtpRepository...");

      const userId = generateUserID();
      const checkUser = await User.findOneAndUpdate(
        { email },
        { isVerified: true, userId },
        { new: true }
      );

      return !!checkUser;
    } catch (error: unknown) {
      console.error("Error in verifyOtpTrue:", error);
      throw new Error("An unexpected error occurred while verifying OTP.");
    }
  }
}

// //////////////////////////////////////////////////////////////////////////////////////////

// // import { generateUserID } from "../../../_lib/common/generateUserID";
// // import { verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
// // import { otpVerify, User } from "../../database/model";
// // import { fail } from "assert";

// // export const verifyOtp =async(otpData:verifyOtpEntity) : Promise <verifyOtpEntity|null> =>{
// //     try {
// //      console.log('console on the otp repository');
// //      const newUserOtp = {
// //          ...otpData
// //      }
// //      console.log(newUserOtp,'.........................');
// //      const otpCreateNewUSer = await otpVerify.create(newUserOtp)
// //      console.log(otpCreateNewUSer," result form repo otp")
// //      if(otpCreateNewUSer){
// //          return otpCreateNewUSer
// //      }
// //      return null
// //     } catch (error : unknown) {
// //      if(error instanceof Error){
// //          throw error
// //      }
// //      throw new Error("An unexpected error is occurred")
// //     }
// //  }

// //  // check the otp scema and delete the user name and do the resend otp

// // export const otpMatchChecking =async(data:verifyOtpEntity) : Promise <boolean|null> =>{
// //    try {
// //     console.log('console on the match otp User repository');
// //     const newUser = {
// //         ...data
// //     }
// //     console.log(newUser,'new');

// //     const checkUser = await otpVerify.findOne({email:data.email})

// //     if(!checkUser){
// //         return false
// //     }else if(checkUser.otp === data.otp){
// //         console.log('log here ***');
// //         return true
// //     }else{
// //         return false
// //     }
// //    } catch (error : unknown) {
// //     if(error instanceof Error){
// //         throw error
// //     }
// //     throw new Error("An unexpected error is occurred")
// //    }
// // }

// // export const verifyOtpTrue =async(email:string) : Promise <boolean|null> =>{
// //    try {
// //     const userId = generateUserID()
// //     console.log();
// //     const checkUser = await User.findOneAndUpdate({email:email},{isVerified :true,userId:userId })
// //      return true
// //    } catch (error : unknown) {
// //     if(error instanceof Error){
// //         throw error
// //     }
// //     throw new Error("An unexpected error is occurred")
// //    }
// // }
