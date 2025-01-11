export interface ICheckByNameUseCase {
    execute(name:String):Promise<boolean|null>
}