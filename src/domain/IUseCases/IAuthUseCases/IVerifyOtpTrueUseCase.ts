import { promises } from "dns";

export interface IVerifyOtpTrueUseCase {
    execute (email:string):Promise<boolean|null>
}