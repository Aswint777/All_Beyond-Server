import { ObjectId } from "mongoose";

export interface EnrolmentEntity {
  _id?: string | ObjectId;
  courseId?:string|ObjectId
  userId?:string|ObjectId
}
