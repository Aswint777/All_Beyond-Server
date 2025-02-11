import { IDependencies } from "../../application/interfaces/IDependencies";
import * as repositories from "../../infrastructure/repositories";
import * as useCases from "../../application/use-Cases"

export const dependencies:IDependencies = {
     repositories,
     useCases
}   