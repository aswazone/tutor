import { ICreateCourseDTO, ICourse } from '@/types/course.type';
import { createHttpError, HttpError } from '@/utils/http-error.utils';

import { ICourseService } from '../interface/course.service.interface';
import { ICourseRepository } from '@/repositories/interface/course.repository.interface';
import { Types } from 'mongoose';
import { HttpStatus } from '@/constants/status.constant';
import { CourseStatus } from '@/models/interface/course.model.interface';
import { QueryFilter, QueryOptions } from '@/utils/queryToFilter.utils';
import { IStudentCoursesRepository } from '@/repositories/interface/studentCourses.repository.interface';
import { sendCourseRejectEmail } from '@/utils/send-email.utils';
import { IUserRepository } from '@/repositories/interface/user.repository.interface';
import { INotificationRepository } from '@/repositories/interface/notification.repository.interface';
import { sendNotificationToUser, sendNotificationToUsers } from '@/utils/send-notification-to-users';
import { INotificationModel } from '@/models/interface/notification.model.interface';
import { IInstructorCourseDTO, IStudentCourseDTO, toInstructorCourseDTOs, toStudentCourseDTOs } from '@/mapper/course.mapper';

export class CourseService implements ICourseService {
  constructor(
    private readonly _courseRepository: ICourseRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _studentCourseRepository: IStudentCoursesRepository,
    private readonly _notificationRepository: INotificationRepository
  ) { }

  createCourse = async (userId: string, courseData: ICreateCourseDTO): Promise<ICourse> => {


    console.log('courseData:', courseData);
    console.log('userId:', userId);
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
    console.log('course after creation:', course);

    return course;
  }

  getCoursesByInstructor = async (userId: string, page: number, limit: number, search: string): Promise<{ data: IInstructorCourseDTO[], total: number }> => {

    const {data,total} = await this._courseRepository.getInstructorCoursesWithFilter(userId, page, limit, search);
    return {data:toInstructorCourseDTOs(data),total};

  }

  getCoursesByStudent = async (userId: string, page: number, limit: number, search: string): Promise<{ data: IStudentCourseDTO[], total: number }> => {

    const {data, total} = await this._studentCourseRepository.getStudentOwnedCourses(userId, page, limit, search);
    console.log(data,'backend-student-courses');
    return {data:toStudentCourseDTOs(data),total};
  }

  getCourseById = async (courseId: string): Promise<ICourse> => {

    const course = await this._courseRepository.getById(courseId, { path: 'tutor' });
    if (!course) throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');

    return course;

  }

  checkIfCoursePurchased = async (userId: string, courseId: string): Promise<boolean> => {

    console.log(userId, courseId, 'checkIfCoursePurchased');
    if (!Types.ObjectId.isValid(courseId)) throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid course id');
    if (!Types.ObjectId.isValid(userId)) throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid user id');
    const studentCourses = await this._studentCourseRepository.getStudentCourses(userId);
    console.log(studentCourses, 'studentCourses--|||')
    if (studentCourses) {
      const isPurchased = studentCourses?.courses.findIndex(course => course.courseId.toString() === courseId) > -1;
      console.log('check-isPurchased:--', isPurchased);
      return isPurchased;
    }
    console.log('check-isPurchased:--', false);
    return false;
  }


  getAllCourses = async (query: { filter: QueryFilter; options: QueryOptions }): Promise<{ courses: ICourse[]; count: number }> => {
    const { filter, options } = query;
    console.log(query);
    const courses = await this._courseRepository.findAllCourses({ isDeleted: false, isActive: true, isVerified: CourseStatus.VERIFIED, ...filter }, options);
    return { courses: courses.result, count: courses.resultCount };
  }

  getAllCoursesWishlist = async (): Promise<ICourse[]> => {
    const courses = await this._courseRepository.getAllCoursesWishlist();
    return courses;
  }

  toggleCourseStatus = async (courseId: string, status: boolean): Promise<void> => {
    const course = await this._courseRepository.findByIdAndUpdate(courseId, { isPublished: status });
    
    if(course){

      const studentIds = course.students.map((student) => student.studentId.toString());
      const uniqueStudentIds = [...new Set(studentIds.flat())];

      console.log('uniqueStudentIds:', uniqueStudentIds, (course._id as string).toString(), course.title);

      const notificationPayload = {
        title: status ? 'Course Published' : 'Course Drafted',
        message: `${course.title} is now ${status ? 'published by your tutor' : 'drafted, contact your tutor'}`,
        type: status ? 'COURSE_ENABLED' : 'COURSE_DISABLED',
        isRead: false,
        relatedId: (course._id as string).toString(),
        onModel: 'Course',
      } as INotificationModel;

      await sendNotificationToUsers(uniqueStudentIds, notificationPayload);

    }
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
      { isVerified, rejectReason: rejectReason ? rejectReason : '' },
      { new: true }
    );

    const notificationPayloadForTutor = {
      title: isVerified === 'verified' ? 'Course Approved' : 'Course Rejected',
      message: `Your course ${course.title} has been ${isVerified === 'verified' ? 'approved by the admin' : 'rejected, check email for more details'}`,
      type: isVerified === 'verified' ? 'COURSE_APPROVED' : 'COURSE_REJECTED',
      isRead: false,
      relatedId: (course._id as string).toString(),
      onModel: 'Course',
    } as INotificationModel;

    if (isVerified === 'rejected') {
      await sendCourseRejectEmail(tutorIdentified.userEmail, course.title);
      await sendNotificationToUser((tutorIdentified._id as string).toString(), notificationPayloadForTutor);
    }else if (isVerified === 'verified') {
      if(course?.isPublished === true){

        const tutorCourses = await this._courseRepository.getByInstructor((tutorIdentified._id as string).toString());
        if(!tutorCourses) createHttpError(HttpStatus.NOT_FOUND, 'Courses not found');

        const studentIds = tutorCourses?.map((course) => course.students.map((student) => student.studentId.toString()));
        const uniqueStudentIds = [...new Set(studentIds.flat())];
        
        const notificationPayloadForStudents = {
          title: 'New Course Available ✨',
          message: `A new course ${course.title} has been published by your tutor`,
          type: 'COURSE_CREATION',
          isRead: false,
          relatedId: (course._id as string).toString(),
          onModel: 'Course',
        } as INotificationModel;
  
        await sendNotificationToUsers(uniqueStudentIds, notificationPayloadForStudents);
      }
      await sendNotificationToUser((tutorIdentified._id as string).toString(), notificationPayloadForTutor);
    }

  }
}
