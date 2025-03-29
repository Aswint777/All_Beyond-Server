import mongoose from "mongoose";
import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { category } from "../../database/model";
import { Course } from "../../database/model/courseModel";

export class CourseRepository
  implements
    Pick<
      IRepositories,
      | "createCourseRepository"
      | "getAllCategoryRepository"
      | "listInstructorRepository"
      |'editCourseRepository'
      |'blockCourseRepository'
    >
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async createCourseRepository(
    courseData: CourseEntity,
    id: string
  ): Promise<CourseEntity | null> {
    try {
      console.log(
        "🔹 createCourseRepository called with data:",
        JSON.stringify(courseData, null, 2)
      );

      // Validate Category
      const courseCategory = await category.findOne({
        name: courseData.categoryName,
      });
      if (!courseCategory) {
        throw new Error(`Category "${courseData.categoryName}" not found.`);
      }
      courseData.categoryName = courseCategory._id;

      console.log("✅ Category found:", courseCategory);

      // Validate Content Structure
      if (
        !Array.isArray(courseData.content) ||
        courseData.content.length === 0
      ) {
        throw new Error(
          "Course content must be an array with at least one module."
        );
      }

      courseData.content.forEach((module, moduleIndex) => {
        if (!module.moduleTitle) {
          throw new Error(
            `❌ Module ${moduleIndex + 1} is missing a moduleTitle.`
          );
        }

        if (!Array.isArray(module.lessons) || module.lessons.length === 0) {
          throw new Error(
            `❌ Module ${moduleIndex + 1} must have at least one lesson.`
          );
        }

        module.lessons.forEach((lesson, lessonIndex) => {
          if (!lesson.lessonTitle) {
            throw new Error(
              `❌ Lesson ${lessonIndex + 1} in Module ${
                moduleIndex + 1
              } is missing a lessonTitle.`
            );
          }
        });
      });

      console.log("✅ Course content validated successfully.");

      // Validate Pricing Option
      if (
        courseData.pricingOption !== "Premium" &&
        courseData.pricingOption !== "Free"
      ) {
        courseData.pricingOption = "Free"; // Default value
      }

      // Convert NaN price to 0
      courseData.price =
        courseData.price !== undefined && !isNaN(courseData.price)
          ? Number(courseData.price)
          : 0;

      console.log(
        "📌 Final Course Data Before Saving:",
        JSON.stringify(courseData, null, 2)
      );

      // Create Course
      const saveCourse = await Course.create({ ...courseData, user: id });
      if (!saveCourse) {
        console.log("❌ Error: Course not saved.");
        return null;
      }

      console.log("✅ Course saved successfully:", saveCourse);
      return saveCourse;
    } catch (error: constant) {
      console.error("❌ Error in createCourseRepository:", error.message);
      throw new Error(error.message);
    }
  }

  // Fetch all the categories
  async getAllCategoryRepository(): Promise<categoryEntity[] | null> {
    try {
      const allCategories = await category.find({ isBlocked: false });
      if (!allCategories) {
        return null;
      }
      return allCategories;
    } catch (error) {
      throw new Error("An unexpected error is occurred");
    }
  }

  async listInstructorRepository(id: string): Promise<CourseEntity[] | null> {
    try {
      return await Course.find({ user: new mongoose.Types.ObjectId(id) });
    } catch (error: constant) {
      throw new Error("An unexpected error is occurred");
    }
  }

  async editCourseRepository(
    courseData: Partial<CourseEntity>
  ): Promise<CourseEntity | null> {
    try {
      const updateData: any = {};

      if (courseData.categoryName) {
        const courseCategory = await category.findOne({
          name: courseData.categoryName,
        });
        if (!courseCategory) {
          throw new Error(`Category "${courseData.categoryName}" not found.`);
        }
        updateData.categoryName = courseCategory._id;
      }

      if (courseData.content) {
        if (
          !Array.isArray(courseData.content) ||
          courseData.content.length === 0
        ) {
          throw new Error(
            "Course content must be an array with at least one module."
          );
        }
        courseData.content.forEach((module, moduleIndex) => {
          if (!module.moduleTitle) {
            throw new Error(
              `❌ Module ${moduleIndex + 1} is missing a moduleTitle.`
            );
          }
          if (!Array.isArray(module.lessons) || module.lessons.length === 0) {
            throw new Error(
              `❌ Module ${moduleIndex + 1} must have at least one lesson.`
            );
          }
          module.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson.lessonTitle) {
              throw new Error(
                `❌ Lesson ${lessonIndex + 1} in Module ${
                  moduleIndex + 1
                } is missing a lessonTitle.`
              );
            }
          });
        });
        updateData.content = courseData.content;
      }

      if (courseData.pricingOption) {
        updateData.pricingOption =
          courseData.pricingOption === "Premium" ||
          courseData.pricingOption === "Free"
            ? courseData.pricingOption
            : "Free";
      }

      if (courseData.price !== undefined) {
        updateData.price = !isNaN(courseData.price)
          ? Number(courseData.price)
          : 0;
      }

      if (courseData.courseTitle)
        updateData.courseTitle = courseData.courseTitle;
      if (courseData.courseDescription)
        updateData.courseDescription = courseData.courseDescription;
      if (courseData.instructor)
        updateData.instructorName = courseData.instructor;
      if (courseData.aboutInstructor)
        updateData.aboutInstructor = courseData.aboutInstructor;
      if (courseData.accountNumber)
        updateData.accountNumber = courseData.accountNumber;
      if (courseData.additionalEmail)
        updateData.additionalEmail = courseData.additionalEmail;
      if (courseData.additionalContactNumber)
        updateData.additionalContactNumber = courseData.additionalContactNumber;
      if (courseData.thumbnailUrl)
        updateData.thumbnailUrl = courseData.thumbnailUrl;

      const updatedCourse = await Course.findByIdAndUpdate(
        { _id: courseData._id },
        { $set: updateData },
        { new: true }
      );

      if (!updatedCourse) {
        console.log("❌ Error: Course not found for update.");
        return null;
      }

      console.log("✅ Course updated successfully:", updatedCourse);
      return updatedCourse;
    } catch (error) {
      console.error("❌ Error in editCourseRepository:", error);
      throw new Error("An unexpected error occurred while updating course.");
    }
  }

  // Block Course

  async blockCourseRepository(courseId: string): Promise<CourseEntity | null> {
    try {
      console.log('repo');
      
      return await Course.findOneAndUpdate(
        { _id: courseId },
        [{ $set: { isBlocked: { $not: "$isBlocked" } } }], // Toggle true/false
        { new: true } // Return the updated document
      );
    } catch (error: constant) {
      throw new Error("An unexpected error occurred while updating course.");
    }
  }
}
