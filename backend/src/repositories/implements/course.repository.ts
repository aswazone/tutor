import { BaseRepository } from '@/repositories/base.repository';
import { ICourseModel } from '@/models/interface/course.model.interface';
import { ICourseRepository } from '../interface/course.repository.interface';
import { CourseModel } from '@/models/implements/course.model';
import { HttpError } from '@/utils/http-error.utils';
import { HttpStatus } from '@/constants/status.constant';
import { PopulateOptions, Types } from 'mongoose';

export class CourseRepository extends BaseRepository<ICourseModel> implements ICourseRepository {
  constructor() {
    super(CourseModel);
  }

  async getByInstructor(instructorId: string): Promise<ICourseModel[]> {
    try {
      if (!Types.ObjectId.isValid(instructorId)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid instructor ID');
      }
      return await this.find({ tutor: new Types.ObjectId(instructorId) , isDeleted: false});
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch instructor courses');
    }
  }

  async getById(id: string, populate?: PopulateOptions): Promise<ICourseModel | null> {
      try {
          if (!Types.ObjectId.isValid(id)) {
              throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid course ID');
          }
          const query = this.model.findById(id);
          
          if (populate) {
              query.populate(populate);
          }

          const course = await query.exec();
          return course;
      } catch (error) {
          if (error instanceof HttpError) throw error;
          throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch course');
      }
  }

  override async create(data: Partial<ICourseModel>): Promise<ICourseModel> {
    try {
      if (!data.tutor || !Types.ObjectId.isValid(data.tutor.toString())) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid instructor ID');
      }
      return await super.create(data);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create course');
    }
  }

  async findAllCourses(
      options: {
          isDeleted?: boolean,
          isActive?: boolean,
          isVerified?: boolean
      },
      populate?: PopulateOptions
  ): Promise<ICourseModel[]> {
      try {
          const query = this.model.find(options);
          
          if (populate) {
              query.populate(populate);
          }

          const result = await query.exec();
          return result;
      } catch (error) {
          if (error instanceof HttpError) throw error;
          throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch courses');
      }
  }
}
