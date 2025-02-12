import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { category } from "../../database/model/categoryModel";


export const addCategory =async(data:categoryEntity) : Promise <categoryEntity|null> =>{
   try {
    
    const addOne = await category.create(data)
    if(addOne){
        return null
    }
    return addOne
   } catch (error : unknown) {
    if(error instanceof Error){
        throw error
    }
    throw new Error("An unexpected error is occurred")
   }
}


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

 
export const getCategoryList = async (): Promise<categoryEntity[] | null> => {
    try {
      console.log("Fetching category list...");
      const categoryList = await category.find();
      return categoryList
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  };
  


  
export const categoryEdit = async (
    id: string,
    name: string,
    description: string,
    type: string
  ): Promise<boolean | null> => {
    try {
      console.log('categoryEdit repo');
      const edit = await category.findOneAndUpdate({_id:id},{$set:{name:name,description:description,type:type}})
      if(edit){
          return true
      }
          return null
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  };
  