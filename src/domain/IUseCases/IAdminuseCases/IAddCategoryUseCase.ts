import { categoryEntity } from "../../entities/categoryEntity";

export interface IAddCategoryUseCase{
    execute(data:categoryEntity):Promise<categoryEntity|null>
}