import mongoose, { ObjectId } from "mongoose";

export interface PaymentEntity {
  _id?: string | ObjectId;
  courseId?:string|ObjectId
  userId?:string|ObjectId
  amount?:number
   instructorShare?:number
  adminShare?:number
}


export interface PopulatedTransaction {
  _id: mongoose.Types.ObjectId;
  userId: { _id: mongoose.Types.ObjectId; username: string }; 
  courseId: {
    _id: mongoose.Types.ObjectId;
    courseTitle: string;
    user: { _id: mongoose.Types.ObjectId; username: string }; 
  };
  amount: number;
  instructorShare: number;
  adminShare: number;
  createdAt: Date;
}

export interface TransactionOutput {
  _id: string;
  studentName: string;
  instructorName: string;
  courseName: string;
  transactionDate: Date;
  instructorShare: number;
  adminShare: number;
}