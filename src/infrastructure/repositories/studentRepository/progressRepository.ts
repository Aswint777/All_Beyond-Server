import mongoose, { Types } from "mongoose";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import {
  CourseLean,
  ProgressEntity,
} from "../../../domain/entities/progressEntity";
import { Course } from "../../database/model";
import { Progress } from "../../database/model/progressModel";
import { IRepositories } from "../../../application/interfaces/IRepositories";

export class ProgressRepository
  implements
    Pick<
      IRepositories,
      | "initializeProgressRepository"
      | "updateProgressRepository"
      | "getProgressRepository"
    >
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async initializeProgressRepository(
    courseId: string,
    userId: string
  ): Promise<ProgressEntity | null> {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        throw new Error("Invalid course or user ID");
      }

      const course = await Course.findById(courseId).lean<CourseLean>();
      if (!course) {
        throw new Error("Course not found");
      }

      let firstLessonId: Types.ObjectId | undefined;
      if (course.content?.[0]?.lessons?.[0]?._id) {
        firstLessonId = course.content[0].lessons[0]._id;
      }

      const progress = await Progress.create({
        courseId: new Types.ObjectId(courseId),
        userId: new Types.ObjectId(userId),
        percentage: 0,
        completedLessons: [],
        unlockedLessons: firstLessonId ? [firstLessonId] : [],
      });

      console.log("Initialized progress:", progress.toObject()); // Debug log
      return progress.toObject() as ProgressEntity;
    } catch (error: any) {
      console.error("Error in initializeProgressRepository:", error);
      throw new Error(error.message || "Failed to initialize progress");
    }
  }

  async updateProgressRepository(
    courseId: string,
    userId: string,
    lessonId: string
  ): Promise<ProgressEntity | null> {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(lessonId)
      ) {
        throw new Error("Invalid course, user, or lesson ID");
      }

      const course = await Course.findById(courseId).lean<CourseLean>();
      if (!course) {
        throw new Error("Course not found");
      }

      if (!course.content || course.content.length === 0) {
        throw new Error("Course has no content");
      }

      // Log module structure to verify all modules
      console.log("Course content:", course.content.map(m => ({
        moduleTitle: m.moduleTitle,
        lessonCount: m.lessons?.length || 0,
        lessonIds: m.lessons?.map(l => l._id.toString()) || []
      })));

      // Step 1: Count total lessons across ALL modules
      let totalLessons = 0;
      for (let m = 0; m < course.content.length; m++) {
        const module = course.content[m];
        if (!module.lessons || module.lessons.length === 0) {
          continue;
        }
        totalLessons += module.lessons.length; // Count lessons from every module
      }

      if (totalLessons === 0) {
        throw new Error("No lessons found in course");
      }

      // Step 2: Find the lesson and determine next lesson to unlock
      let lessonFound = false;
      let nextLessonId: Types.ObjectId | undefined;
      for (let m = 0; m < course.content.length; m++) {
        const module = course.content[m];
        if (!module.lessons || module.lessons.length === 0) {
          continue;
        }
        for (let l = 0; l < module.lessons.length; l++) {
          const lesson = module.lessons[l];
          if (lesson._id.toString() === lessonId) {
            lessonFound = true;
            if (l + 1 < module.lessons.length) {
              nextLessonId = module.lessons[l + 1]._id; // Next lesson in same module
            } else if (
              m + 1 < course.content.length &&
              course.content[m + 1].lessons &&
              course.content[m + 1].lessons.length > 0
            ) {
              nextLessonId = course.content[m + 1].lessons[0]._id; // First lesson in next module
            }
            break;
          }
        }
        if (lessonFound) break;
      }

      if (!lessonFound) {
        throw new Error(`Lesson not found: ${lessonId}`);
      }

      console.log(`Total lessons across all modules: ${totalLessons}`);
      console.log(`Current lesson ID: ${lessonId}, Next lesson ID: ${nextLessonId || "None"}`);

      // Step 3: Atomic update for completed and unlocked lessons
      const update: any = {
        $addToSet: { completedLessons: new Types.ObjectId(lessonId) },
        $set: { percentage: 0 }, // Placeholder, updated below
      };

      if (nextLessonId) {
        update.$addToSet.unlockedLessons = nextLessonId;
      }

      const progress = await Progress.findOneAndUpdate(
        {
          courseId: new Types.ObjectId(courseId),
          userId: new Types.ObjectId(userId),
        },
        update,
        { new: true, returnDocument: "after" }
      );

      if (!progress) {
        throw new Error("Progress not found");
      }

      // Step 4: Calculate and update percentage
      const completedCount = progress.completedLessons.length;
      progress.percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      console.log(`Completed lessons: ${completedCount}, Percentage: ${progress.percentage}%`);
      console.log(`Unlocked lessons: ${progress.unlockedLessons}`);

      await progress.save(); // Save percentage update

      if (progress.percentage === 100 && !nextLessonId) {
        console.log("Course completed: No more lessons to unlock");
      }

      return progress.toObject() as ProgressEntity;
    } catch (error: any) {
      console.error("Error in updateProgressRepository:", error);
      throw new Error(error.message || "Failed to update progress");
    }
  }

  
  async getProgressRepository(
    courseId: string,
    userId: string
  ): Promise<ProgressEntity | null> {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(courseId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        throw new Error("Invalid course or user ID");
      }

      const progress = await Progress.findOne({
        courseId: new mongoose.Types.ObjectId(courseId),
        userId: new mongoose.Types.ObjectId(userId),
      }).lean<ProgressEntity>();

      console.log("Fetched progress:", progress); // Debug log
      return progress || null;
    } catch (error: any) {
      console.error("Error in getProgressRepository:", error);
      throw new Error(error.message || "Failed to fetch progress");
    }
  }
}








// import mongoose, { Types } from "mongoose";
// import { IDependencies } from "../../../application/interfaces/IDependencies";
// import {
//   CourseLean,
//   ProgressEntity,
// } from "../../../domain/entities/progressEntity";
// import { Course } from "../../database/model";
// import { Progress } from "../../database/model/progressModel";
// import { IRepositories } from "../../../application/interfaces/IRepositories";

// export class ProgressRepository
//   implements
//     Pick<
//       IRepositories,
//       | "initializeProgressRepository"
//       | "updateProgressRepository"
//       | "getProgressRepository"
//     >
// {
//   private dependencies: IDependencies;
//   constructor(dependencies: IDependencies) {
//     this.dependencies = dependencies;
//   }

//   async initializeProgressRepository(
//     courseId: string,
//     userId: string
//   ): Promise<ProgressEntity | null> {
//     try {
//       if (
//         !mongoose.Types.ObjectId.isValid(courseId) ||
//         !mongoose.Types.ObjectId.isValid(userId)
//       ) {
//         throw new Error("Invalid course or user ID");
//       }

//       const course = await Course.findById(courseId).lean<CourseLean>();
//       if (!course) {
//         throw new Error("Course not found");
//       }

//       let firstLessonId: Types.ObjectId | undefined;
//       if (course.content?.[0]?.lessons?.[0]?._id) {
//         firstLessonId = course.content[0].lessons[0]._id;
//       }

//       const progress = await Progress.create({
//         courseId: new Types.ObjectId(courseId),
//         userId: new Types.ObjectId(userId),
//         percentage: 0,
//         completedLessons: [],
//         unlockedLessons: firstLessonId ? [firstLessonId] : [],
//       });

//       return progress.toObject() as ProgressEntity;
//     } catch (error: any) {
//       console.error("Error in initializeProgressRepository:", error);
//       throw new Error(error.message || "Failed to initialize progress");
//     }
//   }

//   async updateProgressRepository(
//     courseId: string,
//     userId: string,
//     lessonId: string
//   ): Promise<ProgressEntity | null> {
//     try {
//       if (
//         !mongoose.Types.ObjectId.isValid(courseId) ||
//         !mongoose.Types.ObjectId.isValid(userId) ||
//         !mongoose.Types.ObjectId.isValid(lessonId)
//       ) {
//         throw new Error("Invalid course, user, or lesson ID");
//       }

//       const course = await Course.findById(courseId).lean<CourseLean>();
//       if (!course) {
//         throw new Error("Course not found");
//       }

//       if (!course.content || course.content.length === 0) {
//         throw new Error("Course has no content");
//       }

//       let totalLessons = 0;
//       let lessonFound = false;
//       let nextLessonId: Types.ObjectId | undefined;
//       for (let m = 0; m < course.content.length; m++) {
//         const module = course.content[m];
//         if (!module.lessons || module.lessons.length === 0) {
//           continue;
//         }
//         totalLessons += module.lessons.length;
//         for (let l = 0; l < module.lessons.length; l++) {
//           const lesson = module.lessons[l];
//           if (lesson._id.toString() === lessonId) {
//             lessonFound = true;
//             if (l + 1 < module.lessons.length) {
//               nextLessonId = module.lessons[l + 1]._id;
//             } else if (
//               m + 1 < course.content.length &&
//               course.content[m + 1].lessons &&
//               course.content[m + 1].lessons.length > 0
//             ) {
//               nextLessonId = course.content[m + 1].lessons[0]._id;
//             }
//             break;
//           }
//         }
//         if (lessonFound) break;
//       }

//       if (!lessonFound) {
//         throw new Error("Lesson not found");
//       }

//       console.log(`Total lessons across all modules: ${totalLessons}`); // Debug log

//       const progress = await Progress.findOne({
//         courseId: new Types.ObjectId(courseId),
//         userId: new Types.ObjectId(userId),
//       });

//       if (!progress) {
//         throw new Error("Progress not found");
//       }

//       if (!progress.completedLessons.some((id) => id.toString() === lessonId)) {
//         progress.completedLessons.push(new Types.ObjectId(lessonId));
//       }

//       if (
//         nextLessonId &&
//         !progress.unlockedLessons.some((id) => id.toString() === nextLessonId.toString())
//       ) {
//         progress.unlockedLessons.push(nextLessonId);
//       }

//       const completedCount = progress.completedLessons.length;
//       progress.percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

//       console.log(`Completed lessons: ${completedCount}, Percentage: ${progress.percentage}%`); // Debug log

//       await progress.save();

//       return progress.toObject() as ProgressEntity;
//     } catch (error: any) {
//       console.error("Error in updateProgressRepository:", error);
//       throw new Error(error.message || "Failed to update progress");
//     }
//   }

//   async getProgressRepository(
//     courseId: string,
//     userId: string
//   ): Promise<ProgressEntity | null> {
//     try {
//       if (
//         !mongoose.Types.ObjectId.isValid(courseId) ||
//         !mongoose.Types.ObjectId.isValid(userId)
//       ) {
//         throw new Error("Invalid course or user ID");
//       }

//       const progress = await Progress.findOne({
//         courseId: new mongoose.Types.ObjectId(courseId),
//         userId: new mongoose.Types.ObjectId(userId),
//       }).lean<ProgressEntity>();

//       console.log("Fetched progress:", progress); // Debug log
//       return progress || null;
//     } catch (error: any) {
//       console.error("Error in getProgressRepository:", error);
//       throw new Error(error.message || "Failed to fetch progress");
//     }
//   }
// }


