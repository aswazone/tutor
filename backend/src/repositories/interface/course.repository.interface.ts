import { CourseStatus, ICourseModel } from '@/models/interface/course.model.interface';
import { IBaseRepository } from './base.repository.interface';
import { PopulateOptions } from 'mongoose';

export interface ICourseRepository extends IBaseRepository<ICourseModel> {
    getByInstructor(instructorId: string): Promise<ICourseModel[]>;
    getById(id: string): Promise<ICourseModel | null>;
    findAllCourses(
        options: {
            isDeleted?: boolean, 
            isActive?: boolean, 
            isVerified?: CourseStatus
            isPublished?: boolean
        },
        populate?: PopulateOptions
    ): Promise<ICourseModel[]>
}
