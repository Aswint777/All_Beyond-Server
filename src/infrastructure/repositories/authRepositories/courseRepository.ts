import mongoose from "mongoose";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { constant } from "../../../_lib/common/constant";
import { Course } from "../../database/model/courseModel";
import { category } from "../../database/model";

export class CourseRepository
  implements Pick<IRepositories, "allCoursesRepo">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
   
  // all course
  async allCoursesRepo(page: number, limit: number, search?:string, category?:string): Promise<CourseEntity[] | null> {
    try {
      const pipeline: any[] = [
        {
          $lookup: {
            from: "categories",
            localField: "categoryName",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: "$categoryDetails" },
        {
          $match: {
            isBlocked: false,
            "categoryDetails.isBlocked": false,
            ...(search && {
              $or: [
                { courseTitle: { $regex: search, $options: "i" } },
                { courseDescription: { $regex: search, $options: "i" } },
              ],
            }),
            ...(category && { "categoryDetails.name": category }),
          },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ];
  
      const data = await Course.aggregate(pipeline);
      return data.length > 0 ? (data as CourseEntity[]) : null;
    } catch (error: any) {
      throw new Error("An unexpected error occurred: " + error.message);
    }
  }

  
  async getCoursesCountRepo(): Promise<number> {
    try {
      const pipeline: any[] = [
        {
          $lookup: {
            from: "categories",
            localField: "categoryName",
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        { $unwind: "$categoryDetails" },
        {
          $match: {
            isBlocked: false,
            "categoryDetails.isBlocked": false,
          },
        },
        { $count: "total" },
      ];
  
      const result = await Course.aggregate(pipeline);
      return result[0]?.total || 0;
    } catch (error: any) {
      throw new Error("An unexpected error occurred: " + error.message);
    }
  }
  
 

   // course details page 
   async courseDetailsRepo(courseId: string): Promise<CourseEntity | null> {
    try {  
      return await Course.findOne({ _id: new mongoose.Types.ObjectId(courseId) });
    } catch (error) {
      throw new Error("An unexpected error occurred");
    }
  }
  
  // fetch similar courses
  async similarCourseRepo(courseId:string):Promise<CourseEntity[]|null>{
    try {
      const currentCourse = await Course.findOne({ _id: new mongoose.Types.ObjectId(courseId) });
      
      const similar = await Course.find({categoryName: currentCourse?.categoryName,  _id: { $ne: currentCourse?._id } })
      if(!similar) return null
       return similar
    } catch (error:constant) {
      throw new Error("An unexpected error occurred");
    }
  }
}