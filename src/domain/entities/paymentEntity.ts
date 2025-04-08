import { ObjectId } from "mongoose";

export interface PaymentEntity {
  _id?: string | ObjectId;
  courseId?:string|ObjectId
  userId?:string|ObjectId
  amount?:number
}
