import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../interfaces/IDependencies";


export const getInstructorApplicationUseCase = (dependencies : IDependencies) => {
    console.log('console in the checkByNameUseCAse');
    
    const {repositories : {getInstructorApplication}} = dependencies
    return {
        execute : async() =>{
            try {
                
                const userList = await getInstructorApplication()
                console.log(userList);
                return userList
                
            } catch (error:constant) {
                console.log('Error in checking with get user');
                
                throw new Error(error?.message || "Error in checking with get user");

            }
        }
    }
}