import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { category } from "../../database/model";


export const getCategoryList =async() : Promise <categoryEntity[]|null> =>{
   try {
    console.log('console on the category list');
    
    const categoryList = await category.find()
    if(!categoryList){
        return null
    }
    console.log(categoryList);
    return categoryList
      
   } catch (error : unknown) {
    if(error instanceof Error){
        throw error
    }
    throw new Error("An unexpected error is occurred")
   }
}