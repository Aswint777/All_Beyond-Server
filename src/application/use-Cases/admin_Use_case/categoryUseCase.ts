import { constant } from "../../../_lib/common/constant";
import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";

export class CategoryUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  //listing the categories
  async getCategoryListUseCase(): Promise<categoryEntity[] | null> {
    const { getCategoryList } = this.dependencies.repositories;
    try {
      const categoryList = await getCategoryList();

      return categoryList;
    } catch (error: constant) {
      console.log("Error in checking with listing category");

      throw new Error(
        error?.message || "Error in checking with listing category"
      );
    }
  }

  // creating the categories
  async addCategoryUseCase(
    data: categoryEntity
  ): Promise<categoryEntity | null> {
    const { addCategory, duplicateCategory } = this.dependencies.repositories;

    try {
      const name =
        typeof data.name === "string" ? data.name.trim().toLowerCase() : "";
      const id = ""
      // Check for duplicate category  
      const isDuplicate = await duplicateCategory(name);
      if (isDuplicate) {
        throw new Error("Category already exists.");
      }

      // Add new category
      const result = await addCategory(data);
      if (!result) {
        return null;
      }
      return result;
    } catch (error: any) {
      console.error("Error in add category:", error);
      throw new Error(error?.message || "Error in add category");
    }
  }

  // useCase for the Category blocking and Unblocking
  async blockUnblockCategoryUseCase(
    id: string,
    isBlocked: boolean
  ): Promise<boolean | null> {
    const { block_UnblockCategory } = this.dependencies.repositories;

    try {
      console.log(
        "hai false.................................................."
      );
      if (isBlocked === true) {
        isBlocked = false;
      } else {
        isBlocked = true;
      }
      console.log(isBlocked, "jjjjjjjjjjjjjjjjjj");

      const result = await block_UnblockCategory(id, isBlocked);
      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error: constant) {
      console.log("Error in block and unblock");

      throw new Error(error?.message || "Error in block and unblock");
    }
  }

  // useCase for updating categories
  async categoryEditUseCase(
    id: string,
    name: string,
    description: string
  ): Promise<{ success: boolean; message?: string }> {
    const { categoryEdit, duplicateCategory } = this.dependencies.repositories;
  
    try {
      name = name.trim(); // Ensure name is properly formatted
  
      // Check if the category name is a duplicate
      const isDuplicate = await duplicateCategory(name, id);
      if (isDuplicate) {
        console.log("Duplicate category detected.");
        return { success: false, message: "Category already exists." }; // Return structured response
      }
  
      console.log("categoryEditUseCase: Updating category");
      const result = await categoryEdit(id, name, description);
  
      return result
        ? { success: true, message: "Category updated successfully." }
        : { success: false, message: "Failed to update category." };
    } catch (error: any) {
      console.error("Error in categoryEditUseCase:", error);
      throw new Error(error?.message || "Error occurred in category edit.");
    }
  }
  
  
}
