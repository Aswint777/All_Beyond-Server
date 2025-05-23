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
import { Progress } from "../../database/model/progressModel";

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

interface LessonOutput {
  _id: string;
  lessonTitle: string;
  lessonDescription?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  isLocked: boolean;
}


interface ModuleOutput {
  moduleTitle: string;
  lessons: LessonOutput[];
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
  progress: {
    percentage: number;
    completedLessons: string[];
    unlockedLessons: string[];
  };
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
  async coursePaymentRepository(
    data: PaymentEntity
  ): Promise<PaymentEntity | null> {
    try {
      const existingPayment = await Payment.findOne({
        userId: data.userId,
        courseId: data.courseId,
      });

      if (existingPayment) {
        return null;
      }

      return await Payment.create(data);
    } catch (error: constant) {
      throw new Error("An unexpected error occurred");
    }
  }

  async enrolCourseRepository(
    data: EnrolmentEntity
  ): Promise<EnrolmentEntity | null> {
    try {
      const existingPayment = await Enrolment.findOne({
        userId: data.userId,
        courseId: data.courseId,
      });

      if (existingPayment) {
        return null;
      }

      return await Enrolment.create(data); 

    } catch (error: constant) {
      throw new Error("An unexpected error occurred");
    }
  }


  async studentCoursesRepository(
    userId: string,
    search: string = "",
    skip: number = 0,
    limit: number = 6
  ): Promise<{ courses: CourseEntity[]; totalCourses: number } | null> {
    try {
      const enrolmentQuery = {
        userId: new mongoose.Types.ObjectId(userId),
      };
      const enrolments = await Enrolment.find(enrolmentQuery)
        .select("courseId")
        .skip(skip)
        .limit(limit)
        .lean();

      if (!enrolments.length) {
        return { courses: [], totalCourses: 0 };
      }

      const courseIds = enrolments.map((enrolment) => enrolment.courseId);
      const courseQuery = {
        _id: { $in: courseIds },
        isBlocked: false, 
        ...(search && { courseTitle: { $regex: search, $options: "i" } }), 
      };

      console.log("Course query:", courseQuery);

      const [courses, totalCourses] = await Promise.all([
        Course.find(courseQuery)
          .populate("user", "name")
          .populate("categoryName", "categoryName")
          .lean() as Promise<CourseEntity[]>,
        Enrolment.countDocuments(enrolmentQuery), 
      ]);

      console.log("Repository result:", { courses, totalCourses });

      return { courses, totalCourses };
    } catch (error: any) {
      console.error("Error in studentCoursesRepository:", error);
      throw new Error("An unexpected error occurred");
    }
  }

   async  watchCourseRepository(
    courseId: string,
    userId: string
  ): Promise<CourseOutput | null> {
    try {  
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
      const progress = await Progress.findOne({
        courseId: new mongoose.Types.ObjectId(courseId),
        userId: new mongoose.Types.ObjectId(userId),
      }).lean();
  
      let thumbnailUrl = course.thumbnailUrl;
      if (thumbnailUrl) {
        const thumbnailKey = thumbnailUrl.split("/course_assets/thumbnails/")[1] || thumbnailUrl;
        thumbnailUrl = await getSignedUrlForS3thumbnails(thumbnailKey);
      }
  
      const content: ModuleOutput[] = [];
      if (course.content && Array.isArray(course.content)) {
        for (const module of course.content as any[]) {
          const lessons: LessonOutput[] = [];
          if (module.lessons && Array.isArray(module.lessons)) {
            for (const lesson of module.lessons) {
              let videoUrl: string | undefined;
              const isLocked = isEnrolled && progress
                ? !progress.unlockedLessons.some((id) => id.toString() === lesson._id.toString())
                : true;
  
              if (isEnrolled && lesson.video && !isLocked) {
                try {
                  let videoKey = lesson.video;
                  if (videoKey.includes("course_assets/videos/")) {
                    videoKey = videoKey.split("/course_assets/videos/")[1];
                  } else if (videoKey.includes("/")) {
                    videoKey = videoKey.split("/").pop() || videoKey;
                  }
                  if (videoKey.endsWith(".m3u8")) {
                    videoUrl = await getSignedUrlForCloudFront(videoKey, userId);
                  } else {
                    videoUrl = await getSignedUrlForS3Videos(videoKey);
                  }
                } catch (error: any) {
                  console.error(`Failed to generate URL for lesson ${lesson.lessonTitle}:`, error);
                  videoUrl = undefined;
                }
              }
              lessons.push({
                _id: lesson._id.toString(),
                lessonTitle: lesson.lessonTitle || "Untitled Lesson",
                lessonDescription: lesson.lessonDescription,
                videoUrl,
                thumbnailUrl: lesson.thumbnailUrl,
                isLocked,
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
        instructorName: (course.user as any)?.username || course.instructor || "Unknown",
        aboutInstructor: course.aboutInstructor,
        thumbnailUrl,
        pricingOption: course.pricingOption,
        price: course.price,
        content,
        isEnrolled: !!isEnrolled,
        progress: {
          percentage: progress?.percentage || 0,
          completedLessons: progress?.completedLessons.map((id) => id.toString()) || [],
          unlockedLessons: progress?.unlockedLessons.map((id) => id.toString()) || [],
        },
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
