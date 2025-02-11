import { constant } from "../../../_lib/common/constant";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";
import bcrypt, { compare } from "bcrypt";

export const loginUseCase = (dependencies: IDependencies) => {
//   console.log("console in the login use case ");

  const {
    repositories: { checkByEmail, checkNotBlocked },
  } = dependencies;
  return {
    execute: async (email: string, password: string) => {
      try {
        const user = await checkByEmail(email);
        if (!user) {

          return null;
        }
        if (!user.password) return null;
        console.log(user, "user in the login use case");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return null;
        }
        const access = await checkNotBlocked(email);
        if (access) {
            console.log("access is here ");
            
          return access;
        }
        console.log('no access is there');

        return null;
      } catch (error: constant) {
        console.log("Error in login use case");
        throw new Error(error?.message || "Error in login User");
      }
    },
  };
};
