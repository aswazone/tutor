import { BaseRepository } from '@/repositories/base.repository';
import { CourseModelIF } from '@/models/interface/course.model.interface';
import { CourseRepositoryIF } from '../interface/course.repository.interface';
import { CourseModel } from '@/models/implements/course.model';
import { Types } from 'mongoose';
import { HttpError } from '@/utils/http-error.utils';
import { HttpStatus } from '@/constants/status.constant';

export class CourseRepository extends BaseRepository<CourseModelIF> implements CourseRepositoryIF {
  constructor() {
    super(CourseModel);
  }

  async getByInstructor(instructorId: string): Promise<CourseModelIF[]> {
    try {
      if (!Types.ObjectId.isValid(instructorId)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid instructor ID');
      }
      return await this.find({ tutor: new Types.ObjectId(instructorId) });
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch instructor courses');
    }
  }

  async getById(id: string): Promise<CourseModelIF | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid course ID');
      }
      const course = await this.findById(id);
      return course;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch course');
    }
  }

  override async create(data: Partial<CourseModelIF>): Promise<CourseModelIF> {
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
}
