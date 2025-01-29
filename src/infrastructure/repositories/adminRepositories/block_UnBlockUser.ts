import { UserEntity } from "../../../domain/entities/User";
import { User } from "../../database/model";


export const block_UnBlockUser =async(userId:string,isBlocked:boolean) : Promise <boolean|null> =>{
   try {
    console.log(userId,isBlocked,'is blocked or userId');
    
    const statusChange = await User.findOneAndUpdate({userId:userId},{isBlocked:isBlocked})
    if(statusChange){
        return true
    }
    return false
   } catch (error : unknown) {
    if(error instanceof Error){
        throw error
    }
    throw new Error("An unexpected error is occurred")
   }
}