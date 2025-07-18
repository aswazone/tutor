import { CourseStatus } from "@/models/interface/course.model.interface";
import { IStudentCoursesModel } from "@/models/interface/studentCourses.model.interface";
import { ICreateCourseDTO, ICourse } from "@/types/course.type";
import { QueryFilter, QueryOptions } from "@/utils/queryToFilter.utils";

export interface ICourseService {
  createCourse(userId: string, courseData: ICreateCourseDTO): Promise<ICourse>;
  getCoursesByInstructor(userId: string): Promise<ICourse[]>;
  getCoursesByStudent(userId: string): Promise<IStudentCoursesModel>;
  getCourseById(courseId: string): Promise<ICourse>;
  checkIfCoursePurchased(userId: string, courseId: string): Promise<boolean>;
  getAllCourses(query: {
    filter: QueryFilter;
    options: QueryOptions;
  }): Promise<{ courses: ICourse[]; count: number }>;
  getAllCoursesWishlist(): Promise<ICourse[]>;
  toggleCourseStatus(courseId: string, isPublished: boolean): Promise<void>;
  updateCourse(courseId: string, courseData: Partial<ICreateCourseDTO>): Promise<ICourse>;
  deleteCourse(courseId: string): Promise<void>;
  verifyCourse(courseId: string, isVerified: CourseStatus, rejectReason?: string): Promise<void>;
}
