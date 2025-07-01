import { ObjectId } from "mongoose";

// verify otp
export interface verifyOtpEntity{
    _id? : ObjectId
    email?:string
    otp?:string | number
    createdAT?:Date
}

// match otp
export interface matchOtpEntity{
    email?:string
    otp?:string
}

export interface resetOne{
    email:string
    newPassword:string
}