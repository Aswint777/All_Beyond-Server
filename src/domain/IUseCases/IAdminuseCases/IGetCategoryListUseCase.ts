import { categoryEntity } from "../../entities/categoryEntity";

export interface IGetCategoryListUseCase{
    execute():Promise<categoryEntity|null>
}