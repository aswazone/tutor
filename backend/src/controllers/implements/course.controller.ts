import { Response, NextFunction } from 'express';
import { CourseControllerIF } from '../interfaces/course.controller.interface';
import { CourseServiceIF } from '@/services/interface/course.service.interface';
import { AuthenticatedRequest } from '@/types/auth.type';

export class CourseController implements CourseControllerIF {
  constructor(private readonly _courseService: CourseServiceIF) {}  createCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('----------------------- course controller ------');
    
      if (!req.user?.id) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const course = await this._courseService.createCourse(req.user.id, req.body);
      res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  };

  getInstructorCourses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const courses = await this._courseService.getCoursesByInstructor(req.user.id);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  };

  getCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId } = req.params;
      const course = await this._courseService.getCourseById(courseId);
      res.json(course);
    } catch (error) {
      next(error);
    }
  };
}
