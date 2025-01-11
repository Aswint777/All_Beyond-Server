import {ObjectId} from "mongoose";



// export class User {
//     constructor(
//       public id: string,
//       public email: string,
//       public password: string,
//     ) {}
//   }
  


enum Role {
    student = "student",
    instructor = "instructor",
    admin = "admin"
}

enum Gender {
    male = "male",
    female = "female"
}

enum isVerified {
    requested = "requested",
    approved = "approved",
    rejected = "rejected"
}

interface SocialMedia {
    instagram?: string;
    linkedIn?: string;
    github?: string;
}

interface Contact {
    additionalEmail?: string;
    socialMedia?: SocialMedia;
}

interface Profile {
    avatar?: string;
    dob?: Date;
    gender?: Gender;
}

export interface UserEntity {
    _id?: ObjectId;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    role?: Role;
    profile?: Profile;
    contact?: Contact;
    isBlocked?: boolean;
    isVerified?: isVerified;
    createdAt?: Date;
    updatedAt?: Date;
    profession?: string;
    isNewUser?: boolean;
    additionalEmail?:string;
    profileDescription?:string;
    qualification?: string;
    cv?:string;
}