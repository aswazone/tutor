import { BaseRepository } from '@/repositories/base.repository';
import { CourseStatus, ICourseModel } from '@/models/interface/course.model.interface';
import { ICourseRepository } from '../interface/course.repository.interface';
import { CourseModel } from '@/models/implements/course.model';
import { HttpError } from '@/utils/http-error.utils';
import { HttpStatus } from '@/constants/status.constant';
import { PopulateOptions, Types } from 'mongoose';
import { QueryOptions } from '@/utils/queryToFilter.utils';

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
          isVerified?: CourseStatus,
      },
      populate?: PopulateOptions | QueryOptions
  ): Promise<{ result: ICourseModel[]; resultCount: number }> {
      try {
          const query = this.model.find(options)
          
          if (populate && typeof populate === 'object' && 'path' in populate) {
            query.populate(populate as PopulateOptions);
          }

          if(typeof populate === 'object' && 'sort' in populate) {
              query.sort(populate.sort);
          }

          if(typeof populate === 'object' && 'page' in populate && 'limit' in populate) {
             if(populate.page && populate.limit) {
                query.skip((populate.page - 1) * populate.limit).limit(populate.limit);
             }
          }


          const result = await query.exec();
          const resultCount = await this.model.countDocuments(options);
          console.log(resultCount, 'resultCount');
          return {result, resultCount};
      } catch (error) {
          if (error instanceof HttpError) throw error;
          throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch courses');
      }
  }
}
