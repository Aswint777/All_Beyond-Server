import { IGetStudentsListUseCase } from "../../domain/IUseCases/IAdminuseCases/IGetStudentsListuseCase";
import { ICheckByEmailUseCase } from "../../domain/IUseCases/IAuthUseCases/IcheckByEmailUseCase";
import { ICheckByNameUseCase } from "../../domain/IUseCases/IAuthUseCases/ICheckByNameUseCase";
import { ICreateUserUseCase } from "../../domain/IUseCases/IAuthUseCases/ICreateuserUseCase";
import { ILoginUseCase } from "../../domain/IUseCases/IAuthUseCases/ILoginUseCase";
import { IOtpMatchCheckingUseCase } from "../../domain/IUseCases/IAuthUseCases/IOtpMatchCheckingUseCase";
import { IVerifyOtpUseCase } from "../../domain/IUseCases/IAuthUseCases/IVarifyOtpUseCase";
import { IVerifyOtpTrueUseCase } from "../../domain/IUseCases/IAuthUseCases/IVerifyOtpTrueUseCase";
import { IDependencies } from "./IDependencies";


export interface IUseCases {
    checkByNameUseCase :(dependencies : IDependencies) =>ICheckByNameUseCase
    checkByEmailUseCase :(dependencies : IDependencies ) =>ICheckByEmailUseCase
    createUserUseCase : (dependencies:IDependencies)=>ICreateUserUseCase
    verifyOtpUseCase : (dependencies : IDependencies)=>IVerifyOtpUseCase
    otpMatchCheckingUseCase:(dependencies:IDependencies)=>IOtpMatchCheckingUseCase
    verifyOtpTrueUseCase :(dependencies:IDependencies)=>IVerifyOtpTrueUseCase
    loginUseCase :(dependencies:IDependencies)=>ILoginUseCase

    //admin
    getStudentsListUseCase :(dependencies:IDependencies)=>IGetStudentsListUseCase
}