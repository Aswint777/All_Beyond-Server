import { generateUserID } from "../../../_lib/common/generateUserID";
import { User } from "../../database/model";

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