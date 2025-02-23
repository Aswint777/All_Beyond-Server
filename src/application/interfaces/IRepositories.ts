import { promises } from "dns"
import { createUserEntity, UserEntity } from "../../domain/entities/User"
import { matchOtpEntity, verifyOtpEntity } from "../../domain/entities/verifyOtpEntity"
import { categoryEntity } from "../../domain/entities/categoryEntity"
import { ICreateUserUseCase } from "../../domain/IUseCases/IAuthUseCases/IUserUseCase"


export interface IRepositories {
    // Auth 

    checkByName : (name:string) => Promise<boolean| null>
    checkByEmail : (email:string) =>Promise<UserEntity|null>
    createUser : (data:createUserEntity)=> Promise<UserEntity|null>
        verifyOtp :(data:verifyOtpEntity) =>Promise<verifyOtpEntity|null>
        otpMatchChecking :(data:matchOtpEntity)=>Promise<boolean|null>
        verifyOtpTrue : (data:string)=>Promise<boolean|null>
    checkNotBlocked : (email:string)=>Promise<UserEntity|null>
    getUserDetails : (_id:string)=>Promise<UserEntity|null>
    googleAuth : (email:string,username:string)=>Promise<UserEntity|null>

//     profileEdit: (data:UserEntity)=>Promise<UserEntity|null>
//     uploadPhoto : (userId:string,profilePhoto:string)=>Promise<boolean|null>

//     // Admin

//     getStudentsList :()=>Promise<UserEntity[]|boolean|null>
//     block_UnBlockUser :(userId:string,isBlocked:boolean)=>Promise<boolean|null>
//     addCategory : (data:categoryEntity)=>Promise<categoryEntity|null>
//     getCategoryList :()=>Promise<categoryEntity[]|null>
//     block_UnblockCategory :(id:string,isBlocked:boolean)=>Promise<boolean|null>
//     categoryEdit :(  id: string,name: string,description: string, type: string)=>Promise<boolean|null>
//     applyInstructor :(data:UserEntity)=>Promise<boolean|null>
//     getInstructorApplication : ()=>Promise<UserEntity[]|boolean|null>
//     updateInstructorStatus : (Id: string,status: string )=> Promise<boolean | null>
//     duplicateCategory : (name:string)=>Promise<boolean|null>
}  