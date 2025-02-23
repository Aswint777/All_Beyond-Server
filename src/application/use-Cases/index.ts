import { IDependencies } from "../interfaces/IDependencies";
import { authUseCases } from "./auth_Use-case";
// import { adminUseCases } from "./admin_Use_case";
// import { instructorUseCases } from "./Instructor_use_case";

export const useCases = (dependencies: IDependencies) => {
  return {
    ...authUseCases(dependencies),
    // ...adminUseCases(dependencies),
    // ...instructorUseCases(dependencies),
  };
};




// export * from "./admin_Use_case"
// export * from "./auth_Use-case"
// export * from "./Instructor_use_case"