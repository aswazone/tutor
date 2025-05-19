import { Course } from '@/schema/course.schema';
import { CourseModelIF } from '../interface/course.model.interface';
import { Model } from 'mongoose';

export const CourseModel: Model<CourseModelIF> = Course;
