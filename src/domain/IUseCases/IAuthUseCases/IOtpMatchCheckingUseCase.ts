import { matchOtpEntity } from "../../entities/verifyOtpEntity";

export interface IOtpMatchCheckingUseCase{
       execute (otpData : matchOtpEntity):Promise<boolean|null>
}