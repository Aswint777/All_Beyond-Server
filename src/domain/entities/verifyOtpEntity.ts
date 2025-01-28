import { ObjectId } from "mongoose";

export interface verifyOtpEntity{
    _id? : ObjectId
    // userName?:string
    email?:string
    otp?:string | number
    createdAT?:Date
}

export interface matchOtpEntity{
    email?:string
    otp?:string
}