import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../interfaces/IDependencies";


export const checkByNameUseCase = (dependencies : IDependencies) => {
    console.log('console in the checkByNameUseCAse');
    
    const {repositories : {checkByName}} = dependencies
    return {
        execute : async(name:string) =>{
            try {
                console.log(name, "name is heree .................................................");
                
                return await checkByName(name)
            } catch (error:constant) {
                console.log('Error in checking with name');
                
                throw new Error(error?.message || "Error in checking with name");

            }
        }
    }
}