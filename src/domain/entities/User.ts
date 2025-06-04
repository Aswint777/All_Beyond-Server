import { ObjectId } from "mongoose";

enum Role {
  student = "student",
  instructor = "instructor",
  admin = "admin",
}

enum Gender {
  male = "male",
  female = "female",
}

enum isVerified {
  requested = "requested",
  approved = "approved",
  rejected = "rejected",
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

// user entity
export interface UserEntity {
  _id?: string | ObjectId;
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  role?: Role;
  profile?: Profile;
  // contact?: Contact;
  isBlocked?: boolean;
  isVerified?:boolean
  createdAt?: Date;
  updatedAt?: Date;
  profession?: string;
  isNewUser?: boolean;
  additionalEmail?: string;
  profileDescription?: string;
  qualification?: string;
  cv?: string;
  age?: number;
  address?: string;
  contactNumber?: string;
  gender?: string;
  city?: string;
  country?: string;
  pinNumber?: number | string;
  educationFile?: string;
  profilePhoto?: string;
  status?: string;
  profit?: number | null;
  isAppliedInstructor?: boolean;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  online?:boolean
}

// create user entity
export interface createUserEntity {
  username: string;
  email: string;
  password: string;
}
