import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
export const addCategoryController = (dependencies: IDependencies) => {
  const { useCases } = dependencies;
  const { addCategoryUseCase } = useCases;

  return async (req: Request, res: Response) => {
    try {
      console.log("Request Body:", req.body);

      const { name, description, type } = req.body;

      if (!name || !description || !type) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const data = { name, description, type };

      const addNewCategory = await addCategoryUseCase(dependencies).execute(data);

      if (!addNewCategory) {
        return res.status(400).json({ error: "Failed to create category." });
      }

      res.status(201).json({
        success: true,
        message: "Category created successfully!",
        category: addNewCategory,
      });

    } catch (error: any) {
      console.error("Error in addCategoryController:", error);

      // ✅ Send meaningful error response
      res.status(400).json({ error: error.message || "Internal server error. Please try again later." });
    }
  };
};


export const categoryListController = (dependencies:IDependencies)=>{
    const {useCases} = dependencies
    const {getCategoryListUseCase} = useCases
    return async(req:Request,res:Response)=>{
        try {       
            console.log('console here ...............');
            
            const categories = await getCategoryListUseCase(dependencies).execute()
            console.log(categories,'mmm');
            res.status(201).json({
                success: true,
                message: "category created!",
                data:categories
              });
        } catch (error:constant) {
            
        }
    }
}



export const blockCategoryController = (dependencies:IDependencies)=>{
    const {useCases} = dependencies
    const {block_UnblockCategoryUseCase} = useCases
    return async(req:Request,res:Response)=>{
        try {       
            console.log(req.body,'console here .............mmmmmmmmmm..');
            const {id,status} = req.body
            const categories = await block_UnblockCategoryUseCase(dependencies).execute(id,status)
            console.log('mmm');
            res.status(201).json({
                success: true,
                message: "category created!",
                data : categories
              });
        } catch (error:constant) {
            res
            .status(500)
            .json({ error: "Internal server error. Please try again later." });
        }
    }
}




export const editCategoryController = (dependencies: IDependencies) => {
  const { useCases } = dependencies;
  const { categoryEditUseCase } = useCases;
  return async (req: Request, res: Response) => {
    try {
      console.log("editCategoryController");
      const { id } = req.params;
      console.log(id);
      const { name, description, type } = req.body;
      console.log(name, description, type);
      const edit = await categoryEditUseCase(dependencies).execute(
        id,
        name,
        description,
        type
      );
      if (!edit) {
        return res.status(400).json({ error: "Failed to create category." });

      }
        res.status(httpStatusCode.OK).json({
          success: true,
          data: edit,
          message: "User logged in successfully",
        });
    } catch (error: constant) {
      res
        .status(500)
        res.status(400).json({ error: error.message || "Internal server error. Please try again later." });
      }
  };
};
