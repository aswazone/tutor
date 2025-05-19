import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/types/auth.type";

export interface CourseControllerIF {
  createCourse: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
  getInstructorCourses: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
  getCourse: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
