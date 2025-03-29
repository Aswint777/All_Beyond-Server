import { Request, Response } from "express";
import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import {  getSignedUrlForS3thumbnails } from "../../../_boot/getSignedUrl";

export class CourseController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async allCourses(req: Request, res: Response): Promise<void> {
    const {allCoursesUseCase,getTotalCount} = this.dependencies.useCases
    try {
      console.log('lppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp');
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;
       console.log(page,limit);
       
      // const allCourses = dependencies.useCases.allCoursesUseCase(dependencies);
      // const getTotalCount = dependencies.useCases.getTotalCount(dependencies);

      let courses = await allCoursesUseCase(this.dependencies).execute(page, limit);
      
      if (!courses || courses.length === 0) {
        res.status(200).json({
          success: true,
          message: "No courses found",
          data: {
            courses: [],
            totalPages: 0,
            currentPage: page,
            totalCourses: 0
          },
        });
        return;
      }
        console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
              // ✅ Generate Signed URL for Thumbnails
      courses = await Promise.all(
        courses.map(async (course) => {
          if (course.thumbnailUrl) {
            const fileKey = course.thumbnailUrl.split(
              "/course_assets/thumbnails/"
            )[1]; // Extract filename
            course.thumbnailUrl = await getSignedUrlForS3thumbnails(fileKey);
          }
          return course;
        })
      );
        
      const totalCourses = await getTotalCount(this.dependencies).execute();

      // Remove S3 URL generation for now - add it back when properly implemented
      res.status(200).json({
        success: true,
        message: "Courses retrieved successfully",
        data: {
          courses,
          totalCourses,
          currentPage: page,
          totalPages: Math.ceil(totalCourses / limit),
        },
      });
    } catch (error: any) {
      console.error("Error in allCourses:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error: " + error.message,
        data: {},
      });
    }
  }
  // Add other controller

  
  // // List all the courses 
  // async allCourses(req: Request, res: Response): Promise<void> {
  //   const { allCoursesUseCase } = this.dependencies.useCases;
  //   try {
  //     let courses = await allCoursesUseCase(this.dependencies).execute();
  //     if (!courses) {
  //       res.status(404).json({
  //         success: false,
  //         message: "No courses found",
  //       });
  //       return;
  //     }
  //     // ✅ Generate Signed URL for Thumbnails
  //     courses = await Promise.all(
  //       courses.map(async (course) => {
  //         if (course.thumbnailUrl) {
  //           const fileKey = course.thumbnailUrl.split(
  //             "/course_assets/thumbnails/"
  //           )[1]; // Extract filename
  //           course.thumbnailUrl = await getSignedUrlForS3thumbnails(fileKey);
  //         }
  //         return course;
  //       })
  //     );
  //     res.status(200).json({
  //       success: true,
  //       message: "Course Listing successful",
  //       data: courses,
  //     });
  //   } catch (error: constant) {
  //     res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
  //       success: false,
  //       message: "Internal server error.",
  //     });
  //   }
  // }

  // course details page
  async courseDetailsController(req: Request, res: Response): Promise<void> {
    const { courseDetailsUseCase } = this.dependencies.useCases;
    try {
      const { courseId } = req.params;

      // ✅ Await the result of the Promise before using .map()
      let course = await courseDetailsUseCase(this.dependencies).execute(
        courseId
      );

      if (!course) {
        res.status(404).json({
          success: false,
          message: "No courses found",
        });
        return;
      }
      // Process only if `thumbnailUrl` exists
      if (course.thumbnailUrl) {
        const fileKey = course.thumbnailUrl.split(
          "/course_assets/thumbnails/"
        )[1];
        course.thumbnailUrl = await getSignedUrlForS3thumbnails(fileKey);
      }


      res.status(200).json({
        success: true,
        message: "Course Listing successful",
        data: course,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
  // similar Courses
  async similarCourseController(req: Request, res: Response): Promise<void> {
    const {similarCourseUseCase} = this.dependencies.useCases
    try {
      const {courseId} = req.params
      console.log(courseId,"similar courses ");
       let courses = await similarCourseUseCase(this.dependencies).execute(courseId)
       if (!courses) {
        res.status(404).json({
          success: false,
          message: "No courses found",
        });
        return;
      }
      // ✅ Generate Signed URL for Thumbnails
      courses = await Promise.all(
        courses.map(async (course) => {
          if (course.thumbnailUrl) {
            const fileKey = course.thumbnailUrl.split(
              "/course_assets/thumbnails/"
            )[1]; // Extract filename
            course.thumbnailUrl = await getSignedUrlForS3thumbnails(fileKey);
          }
          return course;
        })
      );
      console.log('samplw data :' , courses);
      
      res.status(200).json({
        success: true,
        message: "Course Listing successful",
        data: courses,
      });
    } catch (error: constant) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
