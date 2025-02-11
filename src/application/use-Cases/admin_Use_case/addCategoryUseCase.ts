import { constant } from "../../../_lib/common/constant";
import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { IDependencies } from "../../interfaces/IDependencies";


export const addCategoryUseCase = (dependencies: IDependencies) => {
    const { repositories: { addCategory } } = dependencies;
    
    return {
      execute: async (data: categoryEntity): Promise<categoryEntity | null> => {
        try {
          const result = await addCategory(data);
          if (!result) {
            return null; // ✅ Change false to null
          }
          return result;
        } catch (error: constant) {
          console.log("Error in add category");
          throw new Error(error?.message || "Error in add category");
        }
      },
    };
  };
  