import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

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
      if (edit) {
        res.status(httpStatusCode.OK).json({
          success: true,
          data: edit,
          message: "User logged in successfully",
        });
      }
    } catch (error: constant) {
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  };
};
