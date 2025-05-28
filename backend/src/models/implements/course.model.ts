import { Course } from '@/schema/course.schema';
import { ICourseModel } from '../interface/course.model.interface';
import { Model } from 'mongoose';

export const CourseModel: Model<ICourseModel> = Course;
