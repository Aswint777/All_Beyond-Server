
export interface IBlock_UnBlockUserUseCase{
    execute(userId:string,isBlocked:boolean):Promise<boolean|null>
}