import mongoose from "mongoose";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { constant } from "../../../_lib/common/constant";
import { Course } from "../../database/model/courseModel";

export class CourseRepository
  implements Pick<IRepositories, "allCoursesRepo">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // list all courses
    async allCoursesRepo(): Promise <CourseEntity[]|null>{
      try {
        return await Course.find();
      } catch (error:constant) {
        throw new Error("An unexpected error is occurred");
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
      console.log(similar,'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
      if(!similar) return null
       return similar
    } catch (error:constant) {
      throw new Error("An unexpected error occurred");
    }
  }
}