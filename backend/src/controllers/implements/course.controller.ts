import { Response, NextFunction } from 'express';
import { ICourseController } from '../interfaces/course.controller.interface';
import { ICourseService } from '@/services/interface/course.service.interface';
import { AuthenticatedRequest } from '@/types/auth.type';
import { CourseStatus } from '@/models/interface/course.model.interface';
import { queryToFilter } from '@/utils/queryToFilter.utils';
import { getPaypalAccessToken } from '@/utils/paypal.utils';

export class CourseController implements ICourseController {
  constructor(private readonly _courseService: ICourseService) {}  
  createCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
            let { id } = req.query;
            const userId = req.user?.id;

            if (id === 'null' || id === 'undefined' || !id) {
                id = undefined;
            }

            const lastId = id || userId;
            console.log('check is it undefined', lastId);

      const courses = await this._courseService.getCoursesByInstructor(lastId as string);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  };

  getStudentCourses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const courses = await this._courseService.getCoursesByStudent(req.user.id);
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

  checkIfCoursePurchased = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId, userId} = req.params;

      const isPurchased = await this._courseService.checkIfCoursePurchased(userId,courseId);
      res.json(isPurchased);
    } catch (error) {
      next(error);
    }
  };

  getAllCourses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.query);
      const paypalToken = await getPaypalAccessToken();
      console.log(paypalToken, 'paypal token');
      const query = await queryToFilter(req);
      const courses = await this._courseService.getAllCourses(query);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  };

  toggleCourseStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId, status } = req.params;
      const isPublished = status === 'true';
      const course = await this._courseService.toggleCourseStatus(courseId, isPublished);
      res.json(course);
    } catch (error) {
      next(error);
    }
  };

  deleteCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId } = req.params;
      const course = await this._courseService.deleteCourse(courseId);
      res.json(course);
    } catch (error) {
      next(error);
    }
  };

  verifyCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId, status } = req.params;
      const {rejectReason} = req.body;
      const isVerified = status as CourseStatus;
      
      await this._courseService.verifyCourse(courseId, isVerified, rejectReason ? rejectReason : '');
      res.json({ message: `Course ${isVerified === CourseStatus.VERIFIED ? 'approved' : 'unapproved'} successfully` });
    } catch (error) {
      next(error);
    }
  };
  
  updateCourse = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { courseId } = req.params;
      if (!req.user?.id) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const course = await this._courseService.updateCourse(courseId, req.body);
      res.json(course);
    } catch (error) {
      next(error);
    }
  };
}
