import { CourseStatus, ICourseModel } from '@/models/interface/course.model.interface';
import { IBaseRepository } from './base.repository.interface';
import { PopulateOptions } from 'mongoose';
import { QueryOptions } from '@/utils/queryToFilter.utils';
import { FindCoursesForAdminResult } from '@/types/admin.type';
import { FindCoursesByInstructorResult } from '@/types/course.type';

export interface ICourseRepository extends IBaseRepository<ICourseModel> {
    
    getInstructorCoursesWithFilter(instructorId: string, page?: number, limit?: number, search?: string): Promise<FindCoursesByInstructorResult>;
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

    findCoursesForAdmin(page: number, limit: number,search: string, tab: string): Promise<FindCoursesForAdminResult>
}
