
export interface IBlock_UnblockCategoryUseCase{
    execute(id:string,isBlocked:boolean):Promise<boolean|null>
}