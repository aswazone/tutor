import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/types/auth.type";

export interface CourseControllerIF {
  createCourse: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
  updateCourse: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
  getInstructorCourses: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
  getCourse: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
  getAllCourses: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
  toggleCourseStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
  deleteCourse: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
  verifyCourse: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
