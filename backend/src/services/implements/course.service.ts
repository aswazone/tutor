import { ICreateCourseDTO, ICourse } from '@/types/course.type';
import { HttpError } from '@/utils/http-error.utils';

import { ICourseService } from '../interface/course.service.interface';
import { ICourseRepository } from '@/repositories/interface/course.repository.interface';
import { Types } from 'mongoose';
import { HttpStatus } from '@/constants/status.constant';
import { CourseStatus } from '@/models/interface/course.model.interface';

export class CourseService implements ICourseService {
  constructor(private readonly _courseRepository: ICourseRepository) {}

  createCourse = async (userId: string, courseData: ICreateCourseDTO): Promise<ICourse> => {


    console.log('courseData:',courseData);
    console.log('userId:',userId);
    console.log('---------------------------- course SErvice ------');
    
    
      const course = await this._courseRepository.create({
        ...courseData.courseDetails,
        publishDate: courseData.publishDate,
        isScheduled: courseData.isScheduled,
        thumbnailKey: courseData.thumbnailKey,
        isPublished: courseData.isPublished,
        modules: courseData.modules,
        tutor: new Types.ObjectId(userId)
      });

      if (!course) {
        throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create course');
      }
      console.log('course after creation:',course);
      return course;
  }

  getCoursesByInstructor = async (userId: string): Promise<ICourse[]> => {

    const courses = await this._courseRepository.getByInstructor(userId);
    if(!courses) throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch instructor courses');
    
    return courses;
  }

  getCourseById = async (courseId: string): Promise<ICourse> => {
    
      const course = await this._courseRepository.getById(courseId);
      if (!course) throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');

      return course;

  }


  getAllCourses = async (): Promise<ICourse[]> => {
    const courses = await this._courseRepository.findAllCourses({isDeleted: false, isActive: true ,isVerified: CourseStatus.VERIFIED,isPublished: true});
    return courses;
  }

  toggleCourseStatus = async (courseId: string, status: boolean): Promise<void> => {
    await this._courseRepository.findByIdAndUpdate(courseId, {isPublished: status});
  }

  updateCourse = async (courseId: string, courseData: Partial<ICreateCourseDTO>): Promise<ICourse> => {
        console.log(courseId);
      if (!Types.ObjectId.isValid(courseId)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid course ID');
      }
      const course = await this._courseRepository.findById(courseId);
      if (!course) {
        throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');
      }

      const updateData = {
        isVerified: 'pending',
        publishDate: courseData.publishDate,
        isScheduled: courseData.isScheduled,
        ...(courseData.courseDetails || {}),
        ...(courseData.thumbnailKey && { thumbnailKey: courseData.thumbnailKey }),
        ...(courseData.modules && { modules: courseData.modules })
      };

      const updatedCourse = await this._courseRepository.findByIdAndUpdate(courseId, updateData, { new: true });
      if (!updatedCourse) {
        throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found after update');
      }

      return updatedCourse;

  }

  deleteCourse = async (courseId: string): Promise<void> => {
    const result = await this._courseRepository.findByIdAndUpdate(courseId, { isDeleted: true });
    if (!result) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');
    }
  }

  verifyCourse = async (courseId: string, isVerified: CourseStatus, rejectReason?: string): Promise<void> => {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid course ID');
    }

    const course = await this._courseRepository.findById(courseId);
    if (!course) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');
    }

    await this._courseRepository.findByIdAndUpdate(
      courseId,
      { isVerified , rejectReason: rejectReason ? rejectReason : '' },
      { new: true }
    );
  }
}
