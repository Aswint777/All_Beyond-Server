import { IBlock_UnBlockUserUseCase } from "../../domain/IUseCases/IAdminuseCases/IBlock_UnBlockUserUseCase";
import { IGetStudentsListUseCase } from "../../domain/IUseCases/IAdminuseCases/IGetStudentsListuseCase";
import { ICheckByEmailUseCase } from "../../domain/IUseCases/IAuthUseCases/IcheckByEmailUseCase";
import { ICheckByNameUseCase } from "../../domain/IUseCases/IAuthUseCases/ICheckByNameUseCase";
import { ICreateUserUseCase } from "../../domain/IUseCases/IAuthUseCases/ICreateuserUseCase";
import { IGetUserDetailsUseCase } from "../../domain/IUseCases/IAuthUseCases/IGetUserDetailsUseCase";
import { ILoginUseCase } from "../../domain/IUseCases/IAuthUseCases/ILoginUseCase";
import { IOtpMatchCheckingUseCase } from "../../domain/IUseCases/IAuthUseCases/IOtpMatchCheckingUseCase";
import { IVerifyOtpUseCase } from "../../domain/IUseCases/IAuthUseCases/IVarifyOtpUseCase";
import { IVerifyOtpTrueUseCase } from "../../domain/IUseCases/IAuthUseCases/IVerifyOtpTrueUseCase";
import { IDependencies } from "./IDependencies";


export interface IUseCases {

    // common

    checkByNameUseCase :(dependencies : IDependencies) =>ICheckByNameUseCase
    checkByEmailUseCase :(dependencies : IDependencies ) =>ICheckByEmailUseCase
    createUserUseCase : (dependencies:IDependencies)=>ICreateUserUseCase
    verifyOtpUseCase : (dependencies : IDependencies)=>IVerifyOtpUseCase
    otpMatchCheckingUseCase:(dependencies:IDependencies)=>IOtpMatchCheckingUseCase
    verifyOtpTrueUseCase :(dependencies:IDependencies)=>IVerifyOtpTrueUseCase
    loginUseCase :(dependencies:IDependencies)=>ILoginUseCase
    getUserDetailsUseCase :(dependencies:IDependencies)=>IGetUserDetailsUseCase

    //admin
    
    getStudentsListUseCase :(dependencies:IDependencies)=>IGetStudentsListUseCase
    block_UnBlockUserUseCase :(dependencies:IDependencies)=>IBlock_UnBlockUserUseCase
}