import { constant } from "../../../_lib/common/constant";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";
import bcrypt, { compare } from "bcrypt";


export const checkByEmailUseCase = (dependencies : IDependencies) => {
    console.log('console in the checkByEmailUseCAse');
    
    const {repositories : {checkByEmail}} = dependencies
    return {
        execute : async(email:string) =>{
            try {
                const result = await checkByEmail(email)
                if(result){
                    
                    return true
                }else{
                    return false
                    
                }
            } catch (error:constant) {
                console.log('Error in checking with email');
                
                throw new Error(error?.message || "Error in checking with email");

            }
        }
    }
}




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



export const loginUseCase = (dependencies: IDependencies) => {
//   console.log("console in the login use case ");

  const {
    repositories: { checkByEmail, checkNotBlocked },
  } = dependencies;
  return {
    execute: async (email: string, password: string) => {
      try {
        const user = await checkByEmail(email);
        if (!user) {

          return null;
        }
        if (!user.password) return null;
        console.log(user, "user in the login use case");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return null;
        }
        const access = await checkNotBlocked(email);
        if (access) {
            console.log("access is here ");
            
          return access;
        }
        console.log('no access is there');

        return null;
      } catch (error: constant) {
        console.log("Error in login use case");
        throw new Error(error?.message || "Error in login User");
      }
    },
  };
};
