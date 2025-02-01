import { ObjectId } from "mongoose";

export interface categoryEntity{
    _id?:ObjectId
    name?:String
    description?:String
    type: "Free" | "Premium"; 
    isBlocked?: boolean; 
    createdAt?: Date; 
    updatedAt?: Date; 
}