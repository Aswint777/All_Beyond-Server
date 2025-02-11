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
    
    age: {
      type: Number,
    },
    qualification: {
      type: String,
    },
    address: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    pinNumber: {
      type: String,
    },
    educationFile: {
      type: String,
    }, // URL of uploaded file
    profilePhoto: {
      type: String,
    }, // URL of profile photo (optional)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // profile:{
    //     avatar:{
    //         type: String
    //     },
    //     dob:{
    //         type: String
    //     },
    //     gender:{
    //         type:String,
    //         enum:["male","female","other"]
    //     }
    // },
    // contact:{
    //     additionalEmail:{
    //         type:String
    //     },
    //     socialMedia: {
    //         instagram: String,
    //         linkedIn: String,
    //         github: String
    //     }
    // },
    // phoneNumber:{
    //     type:String
    // },
    isBlocked:{
        type:Boolean,
        default: false
    },
    isVerified:{
        type:String,
        // enum:["requested","approved","declined","false"],
        default:false
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
    profileDescription:{
        type: String,
    },
    isAppliedInstructor :{
      type : Boolean,
      default : false
    }
},{
    timestamps:true
})

export const User = model<UserEntity>("users",userSchema)







// firstName: String,
// lastName: String,
// age: Number,
// qualification: String,
// profilePhoto: String, // Store Cloudinary URL
// address: String,
// contactNumber: String,
// educationFile: String, // Store Cloudinary URL
// gender: String,
// city: String,
// country: String,
// pinNumber: String
