import { User } from "../../database/model/userModel"

export const checkByEmail =async(email:string) : Promise <boolean> =>{
   try {
    console.log('console on the check by email repository');
    
    const emailExist = await User.findOne({email : email})
    console.log(emailExist," result form email repo")
    if(emailExist){
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