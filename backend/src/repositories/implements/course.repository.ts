import { BaseRepository } from '@/repositories/base.repository';
import { CourseStatus, ICourseModel } from '@/models/interface/course.model.interface';
import { ICourseRepository } from '../interface/course.repository.interface';
import { CourseModel } from '@/models/implements/course.model';
import { HttpError } from '@/utils/http-error.utils';
import { HttpStatus } from '@/constants/status.constant';
import { FilterQuery, PopulateOptions, Types } from 'mongoose';
import { QueryOptions } from '@/utils/queryToFilter.utils';
import { FindCoursesForAdminResult } from '@/types/admin.type';
import { FindCoursesByInstructorResult } from '@/types/course.type';

export class CourseRepository extends BaseRepository<ICourseModel> implements ICourseRepository {
  constructor() {
    super(CourseModel);
  }

  async getInstructorCoursesWithFilter(instructorId: string, page=1, limit=6, search=""): Promise<FindCoursesByInstructorResult> {

    if (!Types.ObjectId.isValid(instructorId)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid instructor ID');
    }
    const filter: FilterQuery<ICourseModel> = { tutor: new Types.ObjectId(instructorId), isDeleted: false };

    if(search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
        ];
    }

    try {
      const data: ICourseModel[] = await this.model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      const total: number = await this.model.countDocuments(filter);
      return { data, total };
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch instructor courses');
    }
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
          // console.log(resultCount, 'resultCount');
          return {result, resultCount};
      } catch (error) {
          if (error instanceof HttpError) throw error;
          throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch courses');
      }
      
  }


  async findCoursesForAdmin(page: number, limit: number,search: string, tab: string): Promise<FindCoursesForAdminResult> {
      try {
        console.log('reaching here');

        const filter: FilterQuery<ICourseModel> = {isDeleted: false};
        
        if(tab === 'approved'){
            filter.isVerified = 'verified';
        } else {
            filter.isVerified = { $ne: 'verified' };
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'tutor.userName': { $regex: search, $options: 'i' } },
            ];
        }
        const data:ICourseModel[] = await this.model.find(filter).populate({path: 'tutor', select: 'userName'}).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
        const total: number = await this.model.countDocuments(filter);

        console.log(data);
        return {data, total};
      } catch (error) {
          if (error instanceof HttpError) throw error;
          throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch courses');
      }
  }

  async getAllCoursesWishlist(): Promise<ICourseModel[]> {
      try {
          return await this.find({ isDeleted: false, isPublished: true });
      } catch (error) {
          if (error instanceof HttpError) throw error;
          throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch courses');
      }
  }
}
