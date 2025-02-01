import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { constant } from "../../../_lib/common/constant";

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

