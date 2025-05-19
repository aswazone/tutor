import { CourseModelIF } from '@/models/interface/course.model.interface';
import { BaseRepositoryIF } from './base.repository.interface';

export interface CourseRepositoryIF extends BaseRepositoryIF<CourseModelIF> {
    getByInstructor(instructorId: string): Promise<CourseModelIF[]>;
    getById(id: string): Promise<CourseModelIF | null>;
}
