import { ICreateCourseDTO, ICourse } from '@/types/course.type';
import { HttpError } from '@/utils/http-error.utils';

import { ICourseService } from '../interface/course.service.interface';
import { ICourseRepository } from '@/repositories/interface/course.repository.interface';
import { Types } from 'mongoose';
import { HttpStatus } from '@/constants/status.constant';
import { CourseStatus } from '@/models/interface/course.model.interface';
import { QueryFilter, QueryOptions } from '@/utils/queryToFilter.utils';
import { IStudentCoursesRepository } from '@/repositories/interface/studentCourses.repository.interface';
import { IStudentCoursesModel } from '@/models/interface/studentCourses.model.interface';
import { sendCourseRejectEmail } from '@/utils/send-email.utils';
import { IUserRepository } from '@/repositories/interface/user.repository.interface';

export class CourseService implements ICourseService {
  constructor(
    private readonly _courseRepository: ICourseRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _studentCourseRepository: IStudentCoursesRepository
  ) {}

  createCourse = async (userId: string, courseData: ICreateCourseDTO): Promise<ICourse> => {


    console.log('courseData:',courseData);
    console.log('userId:',userId);
    console.log('---------------------------- course SErvice ------');
    
    
      const course = await this._courseRepository.create({
        ...courseData.courseDetails,
        publishDate: courseData.publishDate,
        isScheduled: courseData.isScheduled,
        thumbnailKey: courseData.thumbnailKey,
        isPublished: courseData.isScheduled ? false : courseData.isPublished,
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

  getCoursesByStudent = async (userId: string): Promise<IStudentCoursesModel> => {

    const courses = await this._studentCourseRepository.getStudentCourses(userId);
    if(!courses) throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch student courses');

    return courses;
  }

  getCourseById = async (courseId: string): Promise<ICourse> => {
    
      const course = await this._courseRepository.getById(courseId, {path: 'tutor'});
      if (!course) throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');

      return course;

  }

  checkIfCoursePurchased = async (userId: string, courseId: string): Promise<boolean> => {
    if(!Types.ObjectId.isValid(courseId)) throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid course id');
    if(!Types.ObjectId.isValid(userId)) throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid user id');
    const studentCourses = await this._studentCourseRepository.getStudentCourses(userId);
    console.log(studentCourses,'studentCourses--|||')
    if(studentCourses){
      const isPurchased = studentCourses?.courses.findIndex(course => course.courseId.toString() === courseId) > -1;
      console.log('check-isPurchased:--',isPurchased);
      return isPurchased;
    }
    console.log('check-isPurchased:--',false);
    return false;
  }


  getAllCourses = async (query: { filter: QueryFilter; options: QueryOptions }): Promise<{ courses: ICourse[]; count: number }> => {
    const { filter, options } = query;
    console.log(query);
    const courses = await this._courseRepository.findAllCourses({isDeleted: false, isActive: true ,isVerified: CourseStatus.VERIFIED, ...filter}, options);
    return {courses: courses.result, count: courses.resultCount};
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
        isPublished: courseData.isScheduled ? false : courseData.isPublished,
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

    const tutorIdentified = await this._userRepository.findUserById(course?.tutor.toString());
    if (!tutorIdentified) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Tutor not found');
    }

    await this._courseRepository.findByIdAndUpdate(
      courseId,
      { isVerified , rejectReason: rejectReason ? rejectReason : '' },
      { new: true }
    );

    if(isVerified === 'rejected' ){
      await sendCourseRejectEmail(tutorIdentified.userEmail,course.title);
    }
  }
}
