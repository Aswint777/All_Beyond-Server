import mongoose from "mongoose";
import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import {
  CourseDocument,
  EnrolmentEntity,
} from "../../../domain/entities/enrolmentEntity";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";
// import { Enrolment, Enrolment } from "../../database/model/enrolmentModel";
import { Payment } from "../../database/model/paymentModel";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { Course, Enrolment } from "../../database/model";
import {
  getSignedUrlForCloudFront,
  getSignedUrlForS3thumbnails,
  getSignedUrlForS3Videos,
} from "../../../_boot/getSignedUrl";

const API_URL = "http://localhost:5000";

interface Lesson {
  lessonTitle?: string;
  lessonDescription?: string;
  video?: string;
  thumbnailUrl?: string; // Include thumbnailUrl
}

// Define the Module type
interface Module {
  moduleTitle?: string;
  lessons?: Lesson[];
}

interface CourseOutput {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  instructorName: string;
  aboutInstructor?: string;
  thumbnailUrl?: string;
  pricingOption?: "Premium" | "Free";
  price?: number;
  content: ModuleOutput[];
  isEnrolled: boolean;
}

interface LessonOutput {
  lessonTitle: string;
  lessonDescription?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface ModuleOutput {
  moduleTitle: string;
  lessons: LessonOutput[];
}

export class EnrolmentRepository
  implements
    Pick<
      IRepositories,
      | "coursePaymentRepository"
      | "enrolCourseRepository"
      | "studentCoursesRepository"
      | "watchCourseRepository"
    >
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // repository for payment for enrolling course
  async coursePaymentRepository(
    data: PaymentEntity
  ): Promise<PaymentEntity | null> {
    try {
      // Check if payment already exists for this user and course
      const existingPayment = await Payment.findOne({
        userId: data.userId,
        courseId: data.courseId,
      });

      if (existingPayment) {
        // User already bought the course
        return null;
      }

      // Otherwise, create a new payment
      return await Payment.create(data);
    } catch (error: constant) {
      throw new Error("An unexpected error occurred");
    }
  }

  // enrolling course
  async enrolCourseRepository(
    data: EnrolmentEntity
  ): Promise<EnrolmentEntity | null> {
    try {
      const existingPayment = await Enrolment.findOne({
        userId: data.userId,
        courseId: data.courseId,
      });

      if (existingPayment) {
        // User already bought the course
        return null;
      }
      return await Enrolment.create(data);
    } catch (error: constant) {
      throw new Error("An unexpected error occurred");
    }
  }

  // repository  for listing the student enrolled courses

  async studentCoursesRepository(
    userId: string,
    search: string = "",
    skip: number = 0,
    limit: number = 6
  ): Promise<{ courses: CourseEntity[]; totalCourses: number } | null> {
    try {
      // Step 1: Query Enrolment collection to get course IDs for the user
      const enrolmentQuery = {
        userId: new mongoose.Types.ObjectId(userId),
      };

      console.log("Enrolment query:", enrolmentQuery);

      // Fetch enrolments with pagination
      const enrolments = await Enrolment.find(enrolmentQuery)
        .select("courseId") // Only select courseId to optimize
        .skip(skip)
        .limit(limit)
        .lean();

      if (!enrolments.length) {
        console.log("No enrolments found for user:", userId);
        return { courses: [], totalCourses: 0 };
      }

      // Extract course IDs
      const courseIds = enrolments.map((enrolment) => enrolment.courseId);

      console.log("Enrolled course IDs:", courseIds);

      // Step 2: Query Course collection using course IDs
      const courseQuery = {
        _id: { $in: courseIds },
        isBlocked: false, // Only fetch unblocked courses
        ...(search && { courseTitle: { $regex: search, $options: "i" } }), // Case-insensitive search
      };

      console.log("Course query:", courseQuery);

      // Fetch courses and total count
      const [courses, totalCourses] = await Promise.all([
        Course.find(courseQuery)
          .populate("user", "name") // Populate instructor name
          .populate("categoryName", "categoryName") // Optional: Populate category
          .lean() as Promise<CourseEntity[]>,
        Enrolment.countDocuments(enrolmentQuery), // Total enrolments for pagination
      ]);

      console.log("Repository result:", { courses, totalCourses });

      return { courses, totalCourses };
    } catch (error: any) {
      console.error("Error in studentCoursesRepository:", error);
      throw new Error("An unexpected error occurred");
    }
  }

  async watchCourseRepository(
    courseId: string,
    userId: string
  ): Promise<CourseOutput | null> {
    try {
      console.log(
        `watchCourseRepository: courseId=${courseId}, userId=${userId}`
      );

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new Error("Invalid course ID");
      }

      const course = await Course.findOne({ _id: courseId, isBlocked: false })
        .populate({
          path: "user",
          select: "username",
        })
        .lean();

      if (!course) {
        console.warn(`Course not found: ${courseId}`);
        return null;
      }

      const isEnrolled = await Enrolment.exists({
        courseId: new mongoose.Types.ObjectId(courseId),
        userId: new mongoose.Types.ObjectId(userId),
      });
      console.log(`Is enrolled: ${isEnrolled}`);

      let thumbnailUrl = course.thumbnailUrl;
      if (thumbnailUrl) {
        const thumbnailKey =
          thumbnailUrl.split("/course_assets/thumbnails/")[1] || thumbnailUrl;
        thumbnailUrl = await getSignedUrlForS3thumbnails(thumbnailKey);
      }

      const content: ModuleOutput[] = [];
      if (course.content && Array.isArray(course.content)) {
        for (const module of course.content as Module[]) {
          const lessons: LessonOutput[] = [];
          if (module.lessons && Array.isArray(module.lessons)) {
            for (const lesson of module.lessons as Lesson[]) {
              let videoUrl: string | undefined;
              if (isEnrolled && lesson.video) {
                try {
                  // Clean videoKey to extract just the file name
                  let videoKey = lesson.video;
                  if (videoKey.includes("course_assets/videos/")) {
                    videoKey = videoKey.split("/course_assets/videos/")[1];
                  } else if (videoKey.includes("/")) {
                    videoKey = videoKey.split("/").pop() || videoKey;
                  }
                  console.log(
                    `Processing videoKey: ${videoKey} for lesson: ${lesson.lessonTitle}`
                  );
                  if (videoKey.endsWith(".m3u8")) {
                    // HLS video (CloudFront signed URL)
                    videoUrl = await getSignedUrlForCloudFront(
                      videoKey,
                      userId
                    );
                  } else {
                    // MP4 video (S3 signed URL)
                    videoUrl = await getSignedUrlForS3Videos(videoKey);
                  }
                  console.log(`Generated videoUrl: ${videoUrl}`);
                } catch (error: any) {
                  console.error(
                    `Failed to generate URL for lesson ${lesson.lessonTitle}:`,
                    error
                  );
                  videoUrl = undefined;
                }
              }
              lessons.push({
                lessonTitle: lesson.lessonTitle || "Untitled Lesson",
                lessonDescription: lesson.lessonDescription,
                videoUrl,
                thumbnailUrl: lesson.thumbnailUrl, // Now TypeScript recognizes thumbnailUrl
              });
            }
          }
          content.push({
            moduleTitle: module.moduleTitle || "Untitled Module",
            lessons,
          });
        }
      }

      return {
        _id: course._id.toString(),
        courseTitle: course.courseTitle || "Untitled Course",
        courseDescription: course.courseDescription,
        instructorName:
          (course.user as any)?.username || course.instructor || "Unknown",
        aboutInstructor: course.aboutInstructor,
        thumbnailUrl,
        pricingOption: course.pricingOption,
        price: course.price,
        content,
        isEnrolled: !!isEnrolled,
      };
    } catch (error: any) {
      console.error("Error in watchCourseRepository:", error);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async alreadyEnrolledRepository(
    courseId: string,
    userId: string
  ): Promise<boolean | null> {
    try {
      const isEnrolled = await Enrolment.exists({
        courseId: new mongoose.Types.ObjectId(courseId),
        userId: new mongoose.Types.ObjectId(userId),
      });
      if (!isEnrolled) return null;
      return true;
    } catch (error: constant) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}
