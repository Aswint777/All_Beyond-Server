import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

export class ProgressController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async initializeProgress(req: Request, res: Response): Promise<void> {
    const { initializeProgressUseCase } = this.dependencies.useCases;
    try {
      const userId = req.user?._id;
      const { courseId } = req.body;

      if (!userId) {
        res.status(httpStatusCode.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
      }

      if (!courseId) {
        res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ success: false, message: "Course ID is required" });
        return;
      }

      const result = await initializeProgressUseCase(this.dependencies).execute(courseId, userId);

      if (!result) {
        res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Course not found or enrollment failed",
        });
        return;
      }

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Enrollment and progress initialized successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("Error in initializeProgress:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateProgress(req: Request, res: Response): Promise<void> {
    const { updateProgressUseCase } = this.dependencies.useCases;
    try {
      const { courseId } = req.params;
      const { lessonId } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const progress = await updateProgressUseCase(this.dependencies).execute(
        courseId,
        userId,
        lessonId
      );

      if (!progress) {
        res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Progress not found",
        });
        return;
      }

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Progress updated successfully",
        data: progress,
      });
    } catch (error: any) {
      console.error("Error in updateProgress:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getProgress(req: Request, res: Response): Promise<void> {
    const { getProgressUseCase } = this.dependencies.useCases;
    try {
      const { courseId } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const progress = await getProgressUseCase(this.dependencies).execute(courseId, userId);

      if (!progress) {
        res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Progress not found",
        });
        return;
      }

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Progress fetched successfully",
        data: progress,
      });
    } catch (error: any) {
      console.error("Error in getProgress:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}








// import { Request, Response } from "express";
// import { IDependencies } from "../../../application/interfaces/IDependencies";
// import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
// import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";


// export class ProgressController {
//   private dependencies: IDependencies;

//   constructor(dependencies: IDependencies) {
//     this.dependencies = dependencies;
//   }

//   async initializeProgress(req: Request, res: Response): Promise<void> {
//     const { initializeProgressUseCase } = this.dependencies.useCases;
//     try {

//       const user = getUserFromToken(req, res);
//       if (!user) {
//         res.status(401).json({ success: false, message: "Unauthorized" });
//         return;
//       }
//       const userId = user._id;
//       const { courseId } = req.body;

//       if (!courseId) {
//         res
//           .status(httpStatusCode.BAD_REQUEST)
//           .json({ success: false, message: "Course ID is required" });
//         return;
//       }

//       // Enroll the user (assumes this also creates Progress)
//       const result = await initializeProgressUseCase(this.dependencies).execute(courseId, userId);

//       if (!result) {
//         res.status(httpStatusCode.NOT_FOUND).json({
//           success: false,
//           message: "Course not found or enrollment failed",
//         });
//         return;
//       }

//       res.status(httpStatusCode.OK).json({
//         success: true,
//         message: "Enrollment and progress initialized successfully",
//         data: result,
//       });
//     } catch (error: any) {
//       console.error("Error in initializeProgress:", error);
//       res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Internal Server Error",
//       });
//     }
//   }

//   async updateProgress(req: Request, res: Response): Promise<void> {
//     const { updateProgressUseCase } = this.dependencies.useCases;
//     try {
//       const { courseId } = req.params;
//       const { lessonId } = req.body;
//       const userId = req.user?._id;

//       if (!userId) {
//         res.status(httpStatusCode.UNAUTHORIZED).json({
//           success: false,
//           message: "User not authenticated",
//         });
//         return;
//       }

//       const progress = await updateProgressUseCase(this.dependencies).execute(
//         courseId,
//         userId,
//         lessonId
//       );

//       if (!progress) {
//         res.status(httpStatusCode.NOT_FOUND).json({
//           success: false,
//           message: "Progress not found",
//         });
//         return;
//       }

//       res.status(httpStatusCode.OK).json({
//         success: true,
//         message: "Progress updated successfully",
//         data: progress,
//       });
//     } catch (error: any) {
//       console.error("Error in updateProgress:", error);
//       res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Internal Server Error",
//       });
//     }
//   }

//   async getProgress(req: Request, res: Response): Promise<void> {
//     const { getProgressUseCase } = this.dependencies.useCases;
//     try {
      
//       const { courseId } = req.params;
//       const userId = req.user?._id;
      
//       console.log('dataaaaaa',courseId);
//       if (!userId) {
//         res.status(httpStatusCode.UNAUTHORIZED).json({
//           success: false,
//           message: "User not authenticated",
//         });
//         return;
//       }

//       const progress = await getProgressUseCase(this.dependencies).execute(courseId, userId);

//       if (!progress) {
//         res.status(httpStatusCode.NOT_FOUND).json({
//           success: false,
//           message: "Progress not found",
//         });
//         return;
//       }

//       res.status(httpStatusCode.OK).json({
//         success: true,
//         message: "Progress fetched successfully",
//         data: progress,
//       });
//     } catch (error: any) {
//       console.error("Error in getProgress:", error);
//       res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Internal Server Error",
//       });
//     }
//   }
// }