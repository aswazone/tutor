import { CourseStatus, ICourseModel } from '@/models/interface/course.model.interface';
import { IBaseRepository } from './base.repository.interface';
import { PopulateOptions } from 'mongoose';
import { QueryOptions } from '@/utils/queryToFilter.utils';

export interface ICourseRepository extends IBaseRepository<ICourseModel> {
    getByInstructor(instructorId: string): Promise<ICourseModel[]>;
    getById(id: string, populate?: PopulateOptions): Promise<ICourseModel | null>;
    getAllCoursesWishlist(): Promise<ICourseModel[]>
    findAllCourses(
        options: {
            isDeleted?: boolean, 
            isActive?: boolean, 
            isVerified?: CourseStatus
            isPublished?: boolean
            category?: { $in: string[] };
            subcategory?: { $in: string[] };
            level?: { $in: string[] };
            primaryLanguage?: { $in: string[] };
            price?: {
                $eq?: number;
                $gt?: number;
                $lte?: number;
            };
        },
        populate?: PopulateOptions | QueryOptions
    ): Promise<{ result: ICourseModel[]; resultCount: number }>
}
