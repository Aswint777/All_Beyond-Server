import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../interfaces/IDependencies";


export const getUserDetailsUseCase = (dependencies : IDependencies) => {
    console.log('console in the checkByNameUseCAse');
    
    const {repositories : {getUserDetails}} = dependencies
    return {
        execute : async(_id:string) =>{
            try {
                
                return await getUserDetails(_id)
            } catch (error:constant) {
                console.log('Error in user Details');
                
                throw new Error(error?.message || "Error in user Details");

            }
        }
    }
}