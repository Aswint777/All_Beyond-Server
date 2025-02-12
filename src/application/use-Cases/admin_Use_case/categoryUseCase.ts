import { constant } from "../../../_lib/common/constant";
import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { IDependencies } from "../../interfaces/IDependencies";

// useCase of the listing of all the categories
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

//UseCase of creating new categories
export const addCategoryUseCase = (dependencies: IDependencies) => {
    const { repositories: { addCategory } } = dependencies;
    
    return {
      execute: async (data: categoryEntity): Promise<categoryEntity | null> => {
        try {
          const result = await addCategory(data);
          if (!result) {
            return null; // ✅ Change false to null
          }
          return result;
        } catch (error: constant) {
          console.log("Error in add category");
          throw new Error(error?.message || "Error in add category");
        }
      },
    };
  };


// useCase for the Category blocking and Unblocking
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

// useCase for updating categories
export const categoryEditUseCase = (dependencies:IDependencies)=>{
    const {repositories :{categoryEdit}} = dependencies
    return{
        execute : async(id:string,name:string,description:string,type:string)=>{
            try {
                console.log('categoryEditUseCase');
                return await categoryEdit(id,name,description,type)
            } catch (error:constant) {
                throw new Error (error?.message || "error occurred in category Edit ")
            }
        }
    }
}