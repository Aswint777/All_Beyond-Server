import { category } from "../../database/model";

export const block_UnblockCategory =async(id:string,isBlocked:boolean) : Promise <boolean|null> =>{
   try {
    console.log(id,isBlocked,'is blocked ');
    
    const statusChange = await category.findOneAndUpdate({_id:id},{isBlocked:isBlocked})
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