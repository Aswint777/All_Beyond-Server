import { ObjectId } from "mongoose";

export interface categoryEntity {
  _id?: ObjectId;
  name?: String;
  description?: String;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
