import { UserEntity } from "../../../domain/entities/User";
import { User } from "../../database/model";


export const getInstructorApplication =async() : Promise <UserEntity[]|boolean|null> =>{
   try {
    console.log('console on the check by email repository');
    
    const studentsList = await User.find({isVerified:true, isAppliedInstructor:true})
    console.log(studentsList," result form getStudentsList repo")
    if(studentsList){
        return studentsList
    }
    return false
   } catch (error : unknown) {
    if(error instanceof Error){
        throw error
    }
    throw new Error("An unexpected error is occurred")
   }
}