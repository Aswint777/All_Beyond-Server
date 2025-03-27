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
    const { allCoursesUseCase } = this.dependencies.useCases;
    try {
      let courses = await allCoursesUseCase(this.dependencies).execute();
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
      res.status(200).json({
        success: true,
        message: "Course Listing successful",
        data: courses,
      });
    } catch (error: constant) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

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
