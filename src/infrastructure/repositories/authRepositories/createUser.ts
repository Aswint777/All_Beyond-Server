import { UserEntity } from "../../../domain/entities/User";
import { User } from "../../database/model/userModel"

export const createUser =async(data:UserEntity) : Promise <UserEntity|null> =>{
   try {
    console.log('console on the Create User repository');
    const newUser = {
        ...data
    }
    console.log(newUser);
    
    
    const CreateNewUSer = await User.create(newUser)
    console.log(CreateNewUSer," result form repo user Created")
    if(CreateNewUSer){
        return CreateNewUSer 
    }
    return null
   } catch (error : unknown) {
    if(error instanceof Error){
        throw error
    }
    throw new Error("An unexpected error is occurred")
   }
}