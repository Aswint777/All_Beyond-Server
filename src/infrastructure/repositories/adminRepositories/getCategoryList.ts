import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { category } from "../../database/model";


export const getCategoryList = async (): Promise<categoryEntity[] | null> => {
    try {
      console.log("Fetching category list...");
      const categoryList = await category.find();
      return categoryList
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  };
  