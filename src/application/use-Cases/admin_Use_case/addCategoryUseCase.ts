import { constant } from "../../../_lib/common/constant";
import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { IDependencies } from "../../interfaces/IDependencies";



export const addCategoryUseCase = (dependencies : IDependencies) => {
    
    const {repositories : {addCategory}} = dependencies
    return {
        execute : async(data:categoryEntity) =>{
            try {
                const result = await addCategory(data)
                if(!result){
                    return false
                }
                return result
            } catch (error:constant) {
                console.log('Error in add category');
                
                throw new Error(error?.message || "Error in add category");

            }
        }
    }
}