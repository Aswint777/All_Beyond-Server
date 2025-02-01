import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { constant } from "../../../_lib/common/constant";

export const addCategoryController = (dependencies:IDependencies)=>{
    const {useCases} = dependencies
    const {addCategoryUseCase} = useCases
    return async(req:Request,res:Response)=>{
        try {
            console.log(addCategoryController,req.body);
            const {name,description,type} = req.body
            const data ={
                name:name,
                description:description,
                type:type
            }
            console.log('...................llll');
            
            const addNewCategory = await addCategoryUseCase(dependencies).execute(data)
            res.status(201).json({
                success: true,
                message: "category created!",
              });
        } catch (error:constant) {
            
        }
    }
}