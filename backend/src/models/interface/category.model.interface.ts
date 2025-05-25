import { Document } from 'mongoose';

export interface SubCategoryModelIF extends Document {
  name: string;
  isListed: boolean;
  coursesCount: number;
  parentId: Document['_id'];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDocument extends Document {
  name: string;
  isListed: boolean;
  coursesCount: number;
  subCategories: Array<{
    name: string;
    isListed: boolean;
    coursesCount: number;
    parentId:Document['_id'];
  }>;
  createdAt: Date;
  updatedAt: Date;
}
