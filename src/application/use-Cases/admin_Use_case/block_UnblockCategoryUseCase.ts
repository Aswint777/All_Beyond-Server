import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../interfaces/IDependencies";



export const block_UnblockCategoryUseCase = (dependencies : IDependencies) => {
    
    const {repositories : {block_UnblockCategory}} = dependencies
    return {
        execute : async(id:string,isBlocked:boolean) =>{
            try {
                console.log('hai false..................................................');
                if(isBlocked === true){
                    
                    isBlocked = false
                }else{
                    isBlocked = true
                }
                console.log(isBlocked,'jjjjjjjjjjjjjjjjjj');
                
                const result = await block_UnblockCategory(id,isBlocked)
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