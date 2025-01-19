import { constant } from "../../../_lib/common/constant";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";
import bcrypt, { compare } from "bcrypt"

export const loginUseCase = (dependencies : IDependencies) => {
    console.log('console in the login use case ');
    
    const {repositories : {checkByEmail}} = dependencies
    return {
        execute : async(email:string,password:string) =>{
            try {
                const user = await checkByEmail(email)
                if(!user || user===true ){
                  return false
                }
                if(!user.password) return false
                console.log(user,"user in the login use case");
                const isMatch = await bcrypt.compare(password, user.password);
                if(isMatch){
                    return user
                }
                return false
                // const ePassword = user.password
                // const isMatch = await bcrypt.compare(password,user.password)

            } catch (error:constant) {
                console.log('Error in login use case');
                
                throw new Error(error?.message || "Error in login User");

            }
        }
    }
}