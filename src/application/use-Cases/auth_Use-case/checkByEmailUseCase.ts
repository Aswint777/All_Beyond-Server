import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../interfaces/IDependencies";


export const checkByEmailUseCase = (dependencies : IDependencies) => {
    console.log('console in the checkByEmailUseCAse');
    
    const {repositories : {checkByEmail}} = dependencies
    return {
        execute : async(email:string) =>{
            try {
                return await checkByEmail(email)
            } catch (error:constant) {
                console.log('Error in checking with email');
                
                throw new Error(error?.message || "Error in checking with email");

            }
        }
    }
}