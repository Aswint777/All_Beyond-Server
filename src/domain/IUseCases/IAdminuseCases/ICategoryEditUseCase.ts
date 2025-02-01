export interface ICategoryEditUseCase{
    execute (id:string,name:string,description:string,type:string):Promise<boolean|null>
}