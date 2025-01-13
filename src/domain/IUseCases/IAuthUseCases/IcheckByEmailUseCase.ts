export interface ICheckByEmailUseCase {
    execute(email:String):Promise<boolean|null>
}