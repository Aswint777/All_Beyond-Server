import { promises } from "dns"
import { UserEntity } from "../../domain/entities/User"
import { matchOtpEntity, verifyOtpEntity } from "../../domain/entities/verifyOtpEntity"


export interface IRepositories {
    checkByName : (name:string) => Promise<boolean| null>
    checkByEmail : (email:string) =>Promise<UserEntity|null>
    createUser : (data:UserEntity)=> Promise<UserEntity|null>
    verifyOtp :(data:verifyOtpEntity) =>Promise<verifyOtpEntity|null>
    otpMatchChecking :(data:matchOtpEntity)=>Promise<boolean|null>
    verifyOtpTrue : (data:string)=>Promise<boolean|null>
    getUserDetails : (_id:string)=>Promise<UserEntity|null>

    // Admin

    getStudentsList :()=>Promise<UserEntity[]|boolean|null>
    block_UnBlockUser :(userId:string,isBlocked:boolean)=>Promise<boolean|null>
 
}