import { ICheckByEmailUseCase } from "../../domain/IUseCases/IAuthUseCases/icheckByEmailUseCase";
import { ICheckByNameUseCase } from "../../domain/IUseCases/IAuthUseCases/ICheckByNameUseCase";
import { IDependencies } from "./IDependencies";


export interface IUseCases {
    checkByNameUseCase :(dependencies : IDependencies) =>ICheckByNameUseCase
    checkByEmailUseCase :(dependencies : IDependencies ) =>ICheckByEmailUseCase
}