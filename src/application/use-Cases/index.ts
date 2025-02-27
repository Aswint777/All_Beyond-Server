import { IDependencies } from "../interfaces/IDependencies";
import { adminUseCases } from "./admin_Use_case";
import { authUseCases } from "./auth_Use-case";
import { instructorUseCase } from "./Instructor_use_case";

export const useCases = (dependencies: IDependencies) => {
  return {
    ...authUseCases(dependencies),
    ...adminUseCases(dependencies),
    ...instructorUseCase(dependencies),
  };
};
