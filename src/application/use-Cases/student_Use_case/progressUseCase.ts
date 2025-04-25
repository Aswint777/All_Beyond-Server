import { ProgressEntity } from "../../../domain/entities/progressEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class ProgressUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async initializeProgressUseCase(courseId: string, userId: string): Promise<ProgressEntity | null> {
    const { initializeProgressRepository } = this.dependencies.repositories;
    try {
      const course = await initializeProgressRepository(courseId, userId);
      if (!course) return null;

      return course;
    } catch (error: any) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async updateProgressUseCase(courseId: string, userId: string, lessonId: string): Promise<ProgressEntity | null> {
    const { updateProgressRepository } = this.dependencies.repositories;
    try {
      const course = await updateProgressRepository(courseId, userId, lessonId);
      if (!course) return null;

      return course;
    } catch (error: any) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async getProgressUseCase(courseId: string, userId: string): Promise<ProgressEntity | null> {
    const { getProgressRepository } = this.dependencies.repositories;
    try {
      const course = await getProgressRepository(courseId, userId);
      if (!course) return null;

      return course;
    } catch (error: any) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}







// import { constant } from "../../../_lib/common/constant";
// import { ProgressEntity } from "../../../domain/entities/progressEntity";
// import { IDependencies } from "../../interfaces/IDependencies";

// export class ProgressUseCase {
//   private dependencies: IDependencies;

//   constructor(dependencies: IDependencies) {
//     this.dependencies = dependencies;
//   }

//     async initializeProgressUseCase(courseId: string, userId: string): Promise<ProgressEntity | null> {
//       const { initializeProgressRepository } = this.dependencies.repositories;
//       try {
//         const course = await initializeProgressRepository(courseId,userId);
//         if (!course) return null;
  
//         return course;
//       } catch (error: constant) {
//         throw new Error("An unexpected error is occurred");
//       }
//     }

//     async updateProgressUseCase(courseId: string, userId: string,  lessonId: string): Promise<ProgressEntity | null> {
//       const { updateProgressRepository } = this.dependencies.repositories;
//       try {
//         const course = await updateProgressRepository(courseId,userId,lessonId);
//         if (!course) return null;
  
//         return course;
//       } catch (error: constant) {
//         throw new Error("An unexpected error is occurred");
//       }
//     }

//     async getProgressUseCase(courseId: string, userId: string): Promise<ProgressEntity | null> {
//       const { getProgressRepository } = this.dependencies.repositories;
//       try {
//         const course = await getProgressRepository(courseId,userId);
//         if (!course) return null;
  
//         return course;
//       } catch (error: constant) {
//         throw new Error("An unexpected error is occurred");
//       }
//     }


// }