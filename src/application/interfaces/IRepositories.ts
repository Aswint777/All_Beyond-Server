import { promises } from "dns"
import { UserEntity } from "../../domain/entities/User"
import { matchOtpEntity, verifyOtpEntity } from "../../domain/entities/verifyOtpEntity"
import { categoryEntity } from "../../domain/entities/categoryEntity"


export interface IRepositories {
    // Auth 

    checkByName : (name:string) => Promise<boolean| null>
    checkByEmail : (email:string) =>Promise<UserEntity|null>
    createUser : (data:UserEntity)=> Promise<UserEntity|null>
    verifyOtp :(data:verifyOtpEntity) =>Promise<verifyOtpEntity|null>
    otpMatchChecking :(data:matchOtpEntity)=>Promise<boolean|null>
    verifyOtpTrue : (data:string)=>Promise<boolean|null>
    getUserDetails : (_id:string)=>Promise<UserEntity|null>
    checkNotBlocked : (email:string)=>Promise<UserEntity|null>

    // Admin

    getStudentsList :()=>Promise<UserEntity[]|boolean|null>
    block_UnBlockUser :(userId:string,isBlocked:boolean)=>Promise<boolean|null>
    addCategory : (data:categoryEntity)=>Promise<categoryEntity|null>
    getCategoryList :()=>Promise<categoryEntity[]|null>
    block_UnblockCategory :(id:string,isBlocked:boolean)=>Promise<boolean|null>
    categoryEdit :(  id: string,name: string,description: string, type: string)=>Promise<boolean|null>
    applyInstructor :(data:UserEntity)=>Promise<boolean|null>
    getInstructorApplication : ()=>Promise<UserEntity[]|boolean|null>
    updateInstructorStatus : (Id: string,status: string )=> Promise<boolean | null>
}  