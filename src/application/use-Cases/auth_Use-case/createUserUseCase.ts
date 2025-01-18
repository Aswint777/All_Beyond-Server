import { constant } from "../../../_lib/common/constant";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";


export const createUserUseCase = (dependencies : IDependencies) => {
    console.log('console in the create ');
    
    const {repositories : {createUser}} = dependencies
    return {
        execute : async(data:UserEntity) =>{
            try {
                return await createUser(data)
            } catch (error:constant) {
                console.log('Error in Creating User');
                
                throw new Error(error?.message || "Error in Creating User");

            }
        }
    }
}