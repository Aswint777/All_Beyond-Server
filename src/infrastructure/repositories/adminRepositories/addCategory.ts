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