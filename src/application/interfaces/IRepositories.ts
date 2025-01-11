

export interface IRepositories {
    checkByName : (name:string) => Promise<boolean| null>
}