import { CategoryDocument } from '@/models/interface/category.model.interface';
import { BaseRepositoryIF } from './base.repository.interface';

export interface CategoryRepositoryIF extends BaseRepositoryIF<CategoryDocument> {
  findByName(name: string): Promise<CategoryDocument | null>;
  updateCourseCount(categoryId: string, increment: boolean): Promise<CategoryDocument | null>;
  updateSubCategoryCourseCount(categoryId: string, subCategoryId: string, increment: boolean): Promise<CategoryDocument | null>;
  updateListingStatus(categoryId: string, isListed: boolean): Promise<CategoryDocument | null>;
  updateSubCategoryListingStatus(categoryId: string, subCategoryId: string, isListed: boolean): Promise<CategoryDocument | null>;
}
