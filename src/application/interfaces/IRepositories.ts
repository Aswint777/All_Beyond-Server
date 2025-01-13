

export interface IRepositories {
    checkByName : (name:string) => Promise<boolean| null>
    checkByEmail : (email:string) =>Promise<boolean|null>
}