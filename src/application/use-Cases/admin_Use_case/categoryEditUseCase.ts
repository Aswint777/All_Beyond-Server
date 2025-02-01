import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../interfaces/IDependencies";

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