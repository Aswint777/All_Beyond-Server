import { Request, Response } from "express";
import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { getSignedUrlForS3thumbnails, getSignedUrlForS3Videos } from "../../../_boot/getSignedUrl";

export class CourseController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async allCourses(req: Request, res: Response): Promise<void> {
    const { allCoursesUseCase, getTotalCount } = this.dependencies.useCases;
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;

      let courses = await allCoursesUseCase(this.dependencies).execute(
        page,
        limit,
        search,
        category
      );

      if (!courses || courses.length === 0) {
        res.status(200).json({
          success: true,
          message: "No courses found",
          data: {
            courses: [],
            totalPages: 0,
            currentPage: page,
            totalCourses: 0,
          },
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

  // course details page
  async courseDetailsController(req: Request, res: Response): Promise<void> {
    const { courseDetailsUseCase, averageReviewUseCase } = this.dependencies.useCases;
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
       console.log(course,'////////////////////////////////////////////////');
       
      const reviewStatus = await averageReviewUseCase(this.dependencies).execute(courseId)
      console.log(reviewStatus,"reviewStatus....................................................................................................");
       
      // Process only if `thumbnailUrl` exists
      if (course.thumbnailUrl) {
        const fileKey = course.thumbnailUrl.split(
          "/course_assets/thumbnails/"
        )[1];
        course.thumbnailUrl = await getSignedUrlForS3thumbnails(fileKey);
      }

      // Process only the first video
    if (course.content && Array.isArray(course.content)) {
      let videoProcessed = false; // Flag to track if we've processed a video
      for (const module of course.content) {
        if (module.lessons && Array.isArray(module.lessons)) {
          for (const lesson of module.lessons) {
            if (lesson.video && !videoProcessed) { // Only process if video exists and not yet processed
              const videoKey = lesson.video.split("/course_assets/videos/")[1];
              lesson.video = await getSignedUrlForS3Videos(videoKey);
              videoProcessed = true; // Set flag to true after processing the first video
              break; // Exit the inner loop after processing the first video
            }
          }
          if (videoProcessed) break; // Exit the outer loop if we've processed a video
        }
      }
    }

      res.status(200).json({
        success: true,
        message: "Course Listing successful",
        data: {course,reviewStatus}
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
    const { similarCourseUseCase } = this.dependencies.useCases;
    try {
      const { courseId } = req.params;
      // console.log(courseId, "similar courses ");
      let courses = await similarCourseUseCase(this.dependencies).execute(
        courseId
      );
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
      // console.log("samplw data :", courses);

      res.status(200).json({
        success: true,
        message: "Course Listing successful",
        data: courses,
      });
    } catch (error: constant) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // fetch all categories
  async allCategory(req: Request, res: Response): Promise<void> {
    try {
      const { allCategoriesUseCase } = this.dependencies.useCases;
      const allCategories = await allCategoriesUseCase(
        this.dependencies
      ).execute();
      res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "success",
        data: allCategories,
      });
    } catch (error: constant) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
