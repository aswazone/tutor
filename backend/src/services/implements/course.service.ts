import { ICreateCourseDTO, ICourse } from '@/types/course.type';
import { HttpError } from '@/utils/http-error.utils';

import { CourseServiceIF } from '../interface/course.service.interface';
import { CourseRepositoryIF } from '@/repositories/interface/course.repository.interface';
import { Types } from 'mongoose';
import { HttpStatus } from '@/constants/status.constant';

export class CourseService implements CourseServiceIF {
  constructor(private readonly _courseRepository: CourseRepositoryIF) {}

  createCourse = async (userId: string, courseData: ICreateCourseDTO): Promise<ICourse> => {


    console.log('courseData:',courseData);
    console.log('userId:',userId);
    console.log('---------------------------- course SErvice ------');
    
    
      const course = await this._courseRepository.create({
        ...courseData.courseDetails,
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
    const courses = await this._courseRepository.findAll({isDeleted: false, isActive: true ,isVerified: true});
    return courses;
  }

  toggleCourseStatus = async (courseId: string, status: boolean): Promise<void> => {
    await this._courseRepository.findByIdAndUpdate(courseId, {isPublished: status});
  }

  updateCourse = async (courseId: string, courseData: Partial<ICreateCourseDTO>): Promise<ICourse> => {

      const course = await this._courseRepository.findById(courseId);
      if (!course) {
        throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');
      }

      const updateData = {
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

  verifyCourse = async (courseId: string, isVerified: boolean): Promise<void> => {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid course ID');
    }

    const course = await this._courseRepository.findById(courseId);
    if (!course) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');
    }

    await this._courseRepository.findByIdAndUpdate(
      courseId,
      { isVerified },
      { new: true }
    );
  }
}
