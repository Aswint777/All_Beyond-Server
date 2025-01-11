import { User } from "../../database/model/userModel"

export const checkByName =async(name:string) : Promise <boolean> =>{
   try {
    console.log('console on the checkByName repository');
    
    const userNameExist = await User.findOne({username : name})
    console.log(userNameExist," result form repo")
    if(userNameExist){
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