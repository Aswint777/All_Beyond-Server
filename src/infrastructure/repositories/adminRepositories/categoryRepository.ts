import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { UserEntity } from "../../../domain/entities/User";
import { category } from "../../database/model";

export class CategoryRepository
  implements
    Pick<
      IRepositories,
      | "addCategory"
      | "block_UnblockCategory"
      | "getCategoryList"
      | "categoryEdit"
      | "duplicateCategory"
    >
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  async addCategory(data: categoryEntity): Promise<categoryEntity | null> {
    try {
      const addOne = await category.create(data);
      if (!addOne) {
        return null;
      }
      return addOne;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }

  async block_UnblockCategory(
    id: string,
    isBlocked: boolean
  ): Promise<boolean | null> {
    try {
      console.log(id, isBlocked, "is blocked ");

      const statusChange = await category.findOneAndUpdate(
        { _id: id },
        { isBlocked: isBlocked }
      );
      if (statusChange) {
        return true;
      }
      return false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }

  async getCategoryList(): Promise<categoryEntity[] | null> {
    try {
      console.log("Fetching category list...");
      const categoryList = await category.find();
      return categoryList;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async categoryEdit(
    id: string,
    name: string,
    description: string,
    type: string
  ): Promise<boolean | null> {
    try {
      console.log("categoryEdit repo");
      const edit = await category.findOneAndUpdate(
        { _id: id },
        { $set: { name: name, description: description, type: type } }
      );
      if (edit) {
        return true;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }

  async duplicateCategory(name: string): Promise<boolean | null> {
    try {
      const trimmedName = name.trim().toLowerCase();
      const duplicate = await category.findOne({
        name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      });
      if (duplicate) {
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }
}

// import { categoryEntity } from "../../../domain/entities/categoryEntity";
// import { category } from "../../database/model/categoryModel";

// export const addCategory =async(data:categoryEntity) : Promise <categoryEntity|null> =>{
//    try {

//     const addOne = await category.create(data)
//     if(addOne){
//         return null
//     }
//     return addOne
//    } catch (error : unknown) {
//     if(error instanceof Error){
//         throw error
//     }
//     throw new Error("An unexpected error is occurred")
//    }
// }

// export const block_UnblockCategory =async(id:string,isBlocked:boolean) : Promise <boolean|null> =>{
//     try {
//      console.log(id,isBlocked,'is blocked ');

//      const statusChange = await category.findOneAndUpdate({_id:id},{isBlocked:isBlocked})
//      if(statusChange){
//          return true
//      }
//      return false
//     } catch (error : unknown) {
//      if(error instanceof Error){
//          throw error
//      }
//      throw new Error("An unexpected error is occurred")
//     }
//  }

// export const getCategoryList = async (): Promise<categoryEntity[] | null> => {
//     try {
//       console.log("Fetching category list...");
//       const categoryList = await category.find();
//       return categoryList
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw error;
//       }
//       throw new Error("An unexpected error occurred");
//     }
//   };

// export const categoryEdit = async (
//     id: string,
//     name: string,
//     description: string,
//     type: string
//   ): Promise<boolean | null> => {
//     try {
//       console.log('categoryEdit repo');
//       const edit = await category.findOneAndUpdate({_id:id},{$set:{name:name,description:description,type:type}})
//       if(edit){
//           return true
//       }
//           return null
//     } catch (error) {
//       if (error instanceof Error) {
//         throw error;
//       }
//       throw new Error("An unexpected error is occurred");
//     }
//   };

//   export const duplicateCategory = async (name:string): Promise<boolean | null> => {
//     try {
//       const trimmedName = name.trim().toLowerCase();
//       const duplicate = await category.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
//       if(duplicate){
//         return true
//       }
//       return false

//     } catch (error) {
//       if (error instanceof Error) {
//         throw error;
//       }
//       throw new Error("An unexpected error is occurred");
//     }
//   };
