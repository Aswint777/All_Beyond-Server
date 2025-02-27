import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { Request, Response } from "express";

export class CategoryController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // creating the category
  async createCategoryController(req: Request, res: Response): Promise<void> {
    const { addCategoryUseCase } = this.dependencies.useCases;
    try {
      console.log("Request Body:", req.body);

      const { name, description, type } = req.body;

      if (!name || !description || !type) {
        res.status(400).json({ error: "All fields are required." });
        return;
      }

      const data = { name: name, description: description, type: type };

      const addNewCategory = await addCategoryUseCase(
        this.dependencies
      ).execute(data);

      if (!addNewCategory) {
        res.status(400).json({ error: "Failed to create category." });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Category created successfully!",
        category: addNewCategory,
      });
    } catch (error: any) {
      console.error("Error in addCategoryController:", error);

      // ✅ Send meaningful error response
      res.status(400).json({
        error:
          error.message || "Internal server error. Please try again later.",
      });
    }
  }
  // listing the category
  async categoryListController(req: Request, res: Response): Promise<void> {
    const { getCategoryListUseCase } = this.dependencies.useCases;
    try {
      console.log("console here ...............");

      const categories = await getCategoryListUseCase(
        this.dependencies
      ).execute();
      console.log(categories, "mmm");
      res.status(201).json({
        success: true,
        message: "category created!",
        data: categories,
      });
    } catch (error: constant) {
      res.status(400).json({
        error:
          error.message || "Internal server error. Please try again later.",
      });
    }
  }

  // block-unblock the category
  async blockCategoryController(req: Request, res: Response): Promise<void> {
    const { blockUnblockCategoryUseCase } = this.dependencies.useCases;
    try {
      console.log(req.body, "console here .............mmmmmmmmmm..");
      const { id, status } = req.body;
      const categories = await blockUnblockCategoryUseCase(
        this.dependencies
      ).execute(id, status);
      console.log("mmm");
      res.status(201).json({
        success: true,
        message: "category created!",
        data: categories,
      });
    } catch (error: constant) {
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }

  // update category
  async editCategoryController(req: Request, res: Response): Promise<void> {
    const { categoryEditUseCase } = this.dependencies.useCases;
    try {
      console.log("editCategoryController");
      const { id } = req.params;
      console.log(id);
      const { name, description, type } = req.body;
      console.log(name, description, type);
      const edit = await categoryEditUseCase(this.dependencies).execute(
        id,
        name,
        description,
        type
      );
      if (!edit) {
        res.status(400).json({ error: "Failed to create category." });
        return;
      }
      res.status(httpStatusCode.OK).json({
        success: true,
        data: edit,
        message: "User logged in successfully",
      });
    } catch (error: constant) {
      res.status(500);
      res.status(400).json({
        error:
          error.message || "Internal server error. Please try again later.",
      });
    }
  }
}
