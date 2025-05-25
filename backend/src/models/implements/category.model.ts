import { Category } from '@/schema/category.schema';
import { CategoryDocument } from '../interface/category.model.interface';
import { Model } from 'mongoose';

export const CategoryModel: Model<CategoryDocument> = Category;

