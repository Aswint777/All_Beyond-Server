// import { IDependencies } from "../../application/interfaces/IDependencies";
// import { AuthRepositories } from "./authRepositories";
// import { UserRepository } from "./authRepositories/userRepository";
// import { OtpRepository } from "./authRepositories/otpRepository";
// import { ProfileRepository } from "./authRepositories/profileRepository";


// export const repositories = (dependencies: IDependencies) => {
  //   return {
    //     userRepository: new UserRepository(),
    //     // otpRepository: new OtpRepository(),
    //     // profileRepository: new ProfileRepository(),
    //     // ✅ Add other repositories like adminRepositories, instructorRepositories if needed
    //   };
    // };
    
    
    
    // import { IDependencies } from "../../application/interfaces/IDependencies";
    // import { AuthRepositories } from "./authRepositories";
    // // import { AuthRepositories } from "./AuthRepositories/authRepositories";
    // // import { AdminRepositories } from "./AdminRepositories/adminRepositories";
    // // import { InstructorRepositories } from "./InstructorRepositories/instructorRepositories";
    
    // export const repositories = (dependencies: IDependencies) => {
    //   return {
    //     authRepositories: new AuthRepositories(dependencies),
    //   };
    // };
    
    import { IDependencies } from "../../application/interfaces/IDependencies";
    import { AuthRepositories } from "./authRepositories";
    
    export const repositories = (dependencies: IDependencies) => {
      // const authRepos = new AuthRepositories(dependencies);
    
      return {
        ...AuthRepositories(dependencies)
      };
    };
    


// export * from "./adminRepositories";
// export * from "./authRepositories";
// export * from "./instructorRepositories"