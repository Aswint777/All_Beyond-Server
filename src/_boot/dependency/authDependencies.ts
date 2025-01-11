import { IDependencies } from "../../application/interfaces/IDependencies";
import * as repositories from "../../infrastructure/repositories/authRepositories"
import * as useCases from "../../application/use-Cases/auth_Use-case"

export const dependencies:IDependencies = {
     repositories,
     useCases
}