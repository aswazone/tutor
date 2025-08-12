import { Document } from 'mongoose';

export interface ISubCategoryModel extends Document {
  name: string;
  isListed: boolean;
  coursesCount: number;
  parentId: Document['_id'];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryModel extends Document {
  name: string;
  isListed: boolean;
  coursesCount: number;
  subCategories: Array<{
    _id:Document['_id']
    name: string;
    isListed: boolean;
    coursesCount: number;
    parentId:Document['_id'];
  }>;
  createdAt: Date;
  updatedAt: Date;
}
