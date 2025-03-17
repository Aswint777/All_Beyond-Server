import mongoose from "mongoose";
import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { category } from "../../database/model";
import { Course } from "../../database/model/courseModel";


export class CourseRepository
  implements Pick<IRepositories, "createCourseRepository">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async createCourseRepository(courseData: CourseEntity): Promise<CourseEntity | null> {
    try {
      console.log("🔹 createCourseRepository called with data:", JSON.stringify(courseData, null, 2));

      // Validate Category
      const courseCategory = await category.findOne({ name: courseData.categoryName });
      if (!courseCategory) {
        throw new Error(`Category "${courseData.categoryName}" not found.`);
      }
      courseData.categoryName = courseCategory._id;

      console.log("✅ Category found:", courseCategory);

      // Validate Content Structure
      if (!Array.isArray(courseData.content) || courseData.content.length === 0) {
        throw new Error("Course content must be an array with at least one module.");
      }

      courseData.content.forEach((module, moduleIndex) => {
        if (!module.moduleTitle) {
          throw new Error(`❌ Module ${moduleIndex + 1} is missing a moduleTitle.`);
        }

        if (!Array.isArray(module.lessons) || module.lessons.length === 0) {
          throw new Error(`❌ Module ${moduleIndex + 1} must have at least one lesson.`);
        }

        module.lessons.forEach((lesson, lessonIndex) => {
          if (!lesson.lessonTitle) {
            throw new Error(
              `❌ Lesson ${lessonIndex + 1} in Module ${moduleIndex + 1} is missing a lessonTitle.`
            );
          }
        });
      });

      console.log("✅ Course content validated successfully.");

      // Validate Pricing Option
      if (courseData.pricingOption !== "Premium" && courseData.pricingOption !== "Free") {
        courseData.pricingOption = "Free"; // Default value
      }

      // Convert NaN price to 0
      courseData.price = courseData.price !== undefined && !isNaN(courseData.price) ? Number(courseData.price) : 0;

      console.log("📌 Final Course Data Before Saving:", JSON.stringify(courseData, null, 2));

      // Create Course
      const saveCourse = await Course.create(courseData);
      if (!saveCourse) {
        console.log("❌ Error: Course not saved.");
        return null;
      }

      console.log("✅ Course saved successfully:", saveCourse);
      return saveCourse;
    } catch (error:constant) {
      console.error("❌ Error in createCourseRepository:", error.message);
      throw new Error(error.message);
    }
  }


//   // Save new course or create new course 
//   async createCourseRepository(courseData: CourseEntity): Promise<CourseEntity | null> {
//     try {
//       console.log("createCourseRepository called", courseData);
//       console.log(courseData.content,"***************************************************************");
      

//     //   // Convert categoryName to ObjectId if needed
//     //   if (courseData.categoryName && typeof courseData.categoryName === "string") {
//     //     courseData.categoryName = new mongoose.Types.ObjectId(courseData.categoryName);
//     //   }
//     console.log(courseData.categoryName,"OOOOOOO");
//     // let name = courseData.categoryName
//     const courseCategory = await category.findOne({name:courseData.categoryName});
//     console.log(courseCategory,'LLLLLLLLL');
    
//     courseData.categoryName = courseCategory?._id

//       // Convert price if it's NaN
//     //   courseData.price = isNaN(courseData.price) ? 0 : Number(courseData.price);

//       // Ensure `pricingOption` is correct
//       if (courseData.pricingOption !== "Premium" && courseData.pricingOption !== "Free") { 
//         courseData.pricingOption = "Free"; // Default value
//       }  

//       // Create course
//       const saveCourse = await Course.create(courseData);
      
//       if (!saveCourse) {
//         console.log("Error: Course not saved");
//         return null;
//       }
//       return saveCourse;
//     } catch (error) {
//       console.error("Error in createCourseRepository:", error);
//       throw new Error("An unexpected error occurred");
//     }
//   }

  // Fetch all the categories 
  async getAllCategoryRepository():Promise<categoryEntity[]|null>{
    try {
        const allCategories = await category.find({isBlocked:false})
        if(!allCategories){
            return null
        }
        return allCategories
    } catch (error) {
        throw new Error("An unexpected error is occurred");

    }
  }

}
