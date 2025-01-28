
import {model,Schema} from "mongoose"
import { UserEntity } from "../../../domain/entities/User"


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    userId:{
        type : String
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    role:{
        type: String,
        enum:["student","admin","instructor"],
        default: "student"
    },
    profile:{
        avatar:{
            type: String
        },
        dob:{
            type: String
        },
        gender:{
            type:String,
            enum:["male","female","other"]
        }
    },
    contact:{
        additionalEmail:{
            type:String
        },
        socialMedia: {
            instagram: String,
            linkedIn: String,
            github: String
        }
    },
    phoneNumber:{
        type:String
    },
    isBlocked:{
        type:Boolean,
        default: false
    },
    isVerified:{
        type:String,
        enum:["requested","approved","declined","false"],
        default:"false"
    },
    profession:{
        type:String
    },
    profit:{
        type:Number,
        default:0
    },
    cv: {
        type: String,
    },
    isNewUser: {
        type:Boolean,
        default: true
    },
    qualification:{
        type: String,
    },
    profileDescription:{
        type: String,
    }
},{
    timestamps:true
})

export const User = model<UserEntity>("users",userSchema)