import {
  matchOtpEntity,
  resetOne,
  verifyOtpEntity,
} from "../../entities/verifyOtpEntity";
import { promises } from "dns";

export interface IVerifyOtpUseCase {
  execute(otpData: verifyOtpEntity): Promise<verifyOtpEntity | null>;
}

export interface IVerifyOtpTrueUseCase {
  execute(email: string): Promise<boolean | null>;
}
export interface IOtpMatchCheckingUseCase {
  execute(otpData: matchOtpEntity): Promise<boolean | null>;
}


export interface IResetPasswordUseCase {
  execute(Data: resetOne): Promise<boolean | null>;
}