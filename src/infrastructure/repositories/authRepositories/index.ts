
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { createUserEntity, UserEntity } from "../../../domain/entities/User";
import { matchOtpEntity, verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { OtpRepository } from "./otpRepository";
import { UserRepository } from "./userRepository";


export const AuthRepositories = (dependencies: IDependencies) => {
  const UserRepositoryInstance = new UserRepository(dependencies);
  const OtpRepositoryInstance = new OtpRepository(dependencies)

  return {
   //UserRepository
    checkByName: (name: string) => UserRepositoryInstance.checkByName(name),
    checkByEmail:(email: string)=>UserRepositoryInstance.checkByEmail(email),
    checkNotBlocked:(email:string)=>UserRepositoryInstance.checkNotBlocked(email),
    createUser:(data: createUserEntity)=>UserRepositoryInstance.createUser(data),
    getUserDetails:(_id: string)=>UserRepositoryInstance.getUserDetails(_id),
    googleAuth:(email: string,username:string)=>UserRepositoryInstance.googleAuth(email,username),



   //OtpRepository
    verifyOtp:(otpData:verifyOtpEntity)=>OtpRepositoryInstance.verifyOtp(otpData),
    otpMatchChecking:(data:matchOtpEntity)=>OtpRepositoryInstance.otpMatchChecking(data),
    verifyOtpTrue:(email:string)=>OtpRepositoryInstance.verifyOtpTrue(email),

  };
};

// export class AuthRepositories {
//   private userRepository: UserRepository;

//   constructor(dependencies: IDependencies) {
//     this.userRepository = new UserRepository(dependencies);
//   }

//   // ✅ Expose methods at the class level
//   checkByName = (name: string) => this.userRepository.checkByName(name);
//   // checkByEmail = (email: string) => this.userRepository.checkByEmail(email);
//   // createUser = (data: any) => this.userRepository.createUser(data);
// }

// import { IDependencies } from "../../../application/interfaces/IDependencies";
// import { UserEntity } from "../../../domain/entities/User";
// import { UserRepository } from "./userRepository";

// export class AuthRepositories {
//     private userRepository: UserRepository;
  
//     constructor(dependencies: IDependencies) {
//       this.userRepository = new UserRepository(dependencies);
//     }
  
//     // ✅ Directly expose methods
//     checkByName = (name: string) => this.userRepository.checkByName(name);
//     checkByEmail = (email: string) => this.userRepository.checkByEmail(email);
//     createUser = (data: any) => this.userRepository.createUser(data);
//   }

// import { IDependencies } from "../../../application/interfaces/IDependencies";
// import { UserEntity } from "../../../domain/entities/User";
// import { UserRepository } from "./userRepository";

// export class AuthRepositories {
//   private userRepository: UserRepository;
// //   private otpRepository: OtpRepository;
// //   private profileRepository: ProfileRepository;

//   constructor(dependencies: IDependencies) {
//     this.userRepository = new UserRepository(dependencies);
//     // this.otpRepository = new OtpRepository(dependencies);
//     // this.profileRepository = new ProfileRepository(dependencies);

//     // ✅ Assign methods properly
//     this.checkByName = this.userRepository.checkByName.bind(this.userRepository);
//     this.checkByEmail = this.userRepository.checkByEmail.bind(this.userRepository);
//     this.createUser = this.userRepository.createUser.bind(this.userRepository);
//     // this.getUserDetails = this.userRepository.getUserDetails?.bind(this.userRepository);
//     // this.googleAuth = this.userRepository.googleAuth?.bind(this.userRepository);
//     // this.checkNotBlocked = this.userRepository.checkNotBlocked?.bind(this.userRepository);

//     // this.verifyOtp = this.otpRepository.verifyOtp.bind(this.otpRepository);
//     // this.otpMatchChecking = this.otpRepository.otpMatchChecking.bind(this.otpRepository);
//     // this.verifyOtpTrue = this.otpRepository.verifyOtpTrue.bind(this.otpRepository);

//     // this.profileEdit = this.profileRepository.profileEdit.bind(this.profileRepository);
//     // this.uploadPhoto = this.profileRepository.uploadPhoto.bind(this.profileRepository);
//   }

//   // ✅ Expose methods
// //   checkByName: (name: string) => Promise<boolean | null>;
// //   checkByEmail: (email: string) => Promise<UserEntity | null>;
// //   createUser: (data: UserEntity) => Promise<UserEntity | null>;
// //   getUserDetails: (_id: string) => Promise<UserEntity | null>;
// //   googleAuth: (email: string, username: string) => Promise<UserEntity | null>;
// //   checkNotBlocked: (email: string) => Promise<UserEntity | null>;

// //   verifyOtp: (otpData: any) => Promise<any>;
// //   otpMatchChecking: (data: any) => Promise<any>;
// //   verifyOtpTrue: (email: string) => Promise<any>;

// //   profileEdit: (data: any) => Promise<any>;
// //   uploadPhoto: (userId: string, profilePhoto: string) => Promise<any>;
// }



// dependencies.repositories.auth.userRepository.createUser(data);


// // export * from "./checkByName"
// // export * from "./checkByEmail"
// // export * from "./createUser"
// // export * from "./verifyOtp"
// // export * from "./otpMatchChecking"
// // export * from "./verifyOtpTrue"
// // export * from "./getUserDetails"



// export * from "./userRepository"
// export * from "./otpRepository"
// export * from "./profileRepository"