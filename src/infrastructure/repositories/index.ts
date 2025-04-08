import { IDependencies } from "../../application/interfaces/IDependencies";
import { AdminRepositories } from "./adminRepositories";
import { AuthRepositories } from "./authRepositories";
import { InstructorRepositories } from "./instructorRepositories";
import { studentRepositories } from "./studentRepository";

export const repositories = (dependencies: IDependencies) => {
  // const authRepos = new AuthRepositories(dependencies);

  return {
    ...AuthRepositories(dependencies),
    ...InstructorRepositories(dependencies),
    ...AdminRepositories(dependencies),
    ...studentRepositories(dependencies),
  };
};
