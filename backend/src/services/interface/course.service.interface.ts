import { CourseStatus } from "@/models/interface/course.model.interface";
import { ICreateCourseDTO, ICourse } from "@/types/course.type";

export interface ICourseService {
  createCourse(userId: string, courseData: ICreateCourseDTO): Promise<ICourse>;
  getCoursesByInstructor(userId: string): Promise<ICourse[]>;
  getCourseById(courseId: string): Promise<ICourse>;
  getAllCourses(): Promise<ICourse[]>;
  toggleCourseStatus(courseId: string, isPublished: boolean): Promise<void>;
  updateCourse(courseId: string, courseData: Partial<ICreateCourseDTO>): Promise<ICourse>;
  deleteCourse(courseId: string): Promise<void>;
  verifyCourse(courseId: string, isVerified: CourseStatus, rejectReason?: string): Promise<void>;
}
