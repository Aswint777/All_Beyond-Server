import { IDependencies } from "../../application/interfaces/IDependencies";
import { signUpController } from "./signUpController";

export const controller =(dependencies:IDependencies) => {
    return {    
        signUp: signUpController(dependencies),
        // login: loging
    }
}