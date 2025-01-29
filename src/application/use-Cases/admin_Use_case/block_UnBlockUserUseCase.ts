import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../interfaces/IDependencies";



export const block_UnBlockUserUseCase = (dependencies : IDependencies) => {
    
    const {repositories : {block_UnBlockUser}} = dependencies
    return {
        execute : async(userId:string,isBlocked:boolean) =>{
            try {
                const result = await block_UnBlockUser(userId,isBlocked)
                if(result){
                    return true
                }else{
                    return false
                }
            } catch (error:constant) {
                console.log('Error in block and unblock');
                
                throw new Error(error?.message || "Error in block and unblock");

            }
        }
    }
}