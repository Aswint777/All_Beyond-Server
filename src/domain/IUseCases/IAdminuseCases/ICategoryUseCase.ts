import { categoryEntity } from "../../entities/categoryEntity";

export interface IAddCategoryUseCase{
    execute(data:categoryEntity):Promise<categoryEntity|null>
}


export interface IBlock_UnblockCategoryUseCase{
    execute(id:string,isBlocked:boolean):Promise<boolean|null>
}


export interface ICategoryEditUseCase{
    execute (id:string,name:string,description:string,type:string):Promise<boolean|null>
}


export interface IGetCategoryListUseCase{
    execute():Promise<categoryEntity[]|null>
}