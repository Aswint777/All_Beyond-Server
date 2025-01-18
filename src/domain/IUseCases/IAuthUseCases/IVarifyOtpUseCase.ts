import { verifyOtpEntity } from "../../entities/verifyOtpEntity";

export interface IVerifyOtpUseCase{
   execute (otpData : verifyOtpEntity):Promise<verifyOtpEntity|null>
}