import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { constant } from "../../../_lib/common/constant";
import jwt from "jsonwebtoken";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";
import { getSignedUrlForS3 } from "../../../_boot/getSignedUrl";

interface S3File extends Express.Multer.File {
  location: string; // S3 adds 'location' property with the file URL
  key: string; // S3 key/path of the file
}

export class CourseController {
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // create new Course
  async createCourse(req: Request, res: Response): Promise<void> {
    const { createCourseUseCase } = this.dependencies.useCases;

    try {
      if (!req.user) {
        return;
      }
      const token = req.cookies.access_token;
      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      // 🛑 Verify JWT
      const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
      const decoded = jwt.verify(token, secretKey) as {
        _id: string;
        email: string;
        role: string;
      };
      const id = decoded._id;

      if (!req.files || !Array.isArray(req.files)) {
        res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ message: "No files uploaded" });
        return;
      }
      const files = req.files as S3File[];

      const {
        title,
        courseDescription,
        category,
        instructorName,
        aboutInstructor,
        isPaid,
        price,
        accountNumber,
        email,
        phone,
        modules, // Expecting modules as an array from FormData
      } = req.body;

      const thumbnail = files.find((file) => file.fieldname === "thumbnail");
      const videoFiles = files.filter((file) =>
        file.fieldname.startsWith("video_")
      );

      // Parse module and lesson data from req.body.modules
      const content = modules.map((module: any, moduleIndex: number) => ({
        moduleTitle: module.title,
        lessons: module.lessons.map((lesson: any, lessonIndex: number) => {
          const video = videoFiles.find(
            (file) => file.fieldname === `video_${moduleIndex}_${lessonIndex}`
          );
          return {
            lessonTitle: lesson.title,
            lessonDescription: lesson.lessonDescription,
            video: video?.location || "",
          };
        }),
      }));

      const courseData = {
        courseTitle: title,
        courseDescription,
        categoryName: category,
        instructorName,
        aboutInstructor,
        pricingOption: isPaid, // Match schema field
        Price: price ? parseFloat(price) : undefined,
        accountNumber: accountNumber ? parseInt(accountNumber) : undefined,
        additionalEmail: email,
        additionalContactNumber: phone,
        thumbnailUrl: thumbnail?.location || "",
        thumbnailKey: thumbnail?.key || "",
        content,
      };

      const savedCourse = await createCourseUseCase(this.dependencies).execute(
        courseData,
        id
      );
      res
        .status(httpStatusCode.CREATED)
        .json({ message: "Course created successfully", course: savedCourse });
    } catch (error) {
      console.error("Error in add Course:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  // controller for fetching all categories
  async getCourseCategories(req: Request, res: Response): Promise<void> {
    const { allCategoriesUseCase } = this.dependencies.useCases;
    try {
      const allCategories = await allCategoriesUseCase(
        this.dependencies
      ).execute();
      res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Instructor application submitted successfully",
        data: allCategories,
      });
    } catch (error) {
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
      return;
    }
  }

  // Course listing in the Instructor side
  async listInstructorCourse(req: Request, res: Response): Promise<void> {
    const { listInstructorCourseUseCase } = this.dependencies.useCases;
    try {
      console.log("Listing the courses...");
      const user = getUserFromToken(req, res);
      if (!user) return;
      const id = user._id;

      let courses = await listInstructorCourseUseCase(
        this.dependencies
      ).execute(id);
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
            course.thumbnailUrl = await getSignedUrlForS3(fileKey);
          }
          return course;
        })
      );
      res.status(200).json({
        success: true,
        message: "Course Listing successful",
        data: courses,
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

}

