import { constant } from "../../../_lib/common/constant";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";


export const applyInstructorUseCase = (dependencies : IDependencies) => {
    
    const {repositories : {applyInstructor}} = dependencies
    return {
        execute : async(data:UserEntity) =>{
            try {
                return await applyInstructor(data)
            } catch (error:constant) {
                console.log('Error in apply ');
                
                throw new Error(error?.message || "Error in otp apply instructor");

            }
        }
    }
}