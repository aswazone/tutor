import { Category } from '@/schema/category.schema';
import { ICategoryModel } from '../interface/category.model.interface';
import { Model } from 'mongoose';

export const CategoryModel: Model<ICategoryModel> = Category;

