import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../interfaces/IDependencies";


export const getCategoryListUseCase = (dependencies : IDependencies) => {
    
    const {repositories : {getCategoryList}} = dependencies
    return {
        execute : async() =>{
            try {
                console.log('<><><><>');
                
                const categoryList = await getCategoryList()
                
                return categoryList
                
            } catch (error:constant) {
                console.log('Error in checking with listing category');
                
                throw new Error(error?.message || 'Error in checking with listing category');

            }
        }
    }
}