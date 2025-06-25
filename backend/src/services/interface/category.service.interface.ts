import { CategoryDocument } from '@/models/interface/category.model.interface';
import { ICategoryCreateDTO, ISubCategoryCreateDTO } from '@/types/category.type';

export interface ICategoryService {
  createCategory(data: ICategoryCreateDTO): Promise<CategoryDocument>;
  createSubCategory(data: ISubCategoryCreateDTO): Promise<CategoryDocument>;
  getAllCategories(): Promise<CategoryDocument[]>;
  getCategoryById(id: string): Promise<CategoryDocument>;
  updateCategory(id: string, data: ICategoryCreateDTO): Promise<CategoryDocument>;
  updateSubCategory(categoryId: string, subCategoryId: string, data: ICategoryCreateDTO): Promise<CategoryDocument>;
  toggleCategoryStatus(id: string, currentStatus: boolean): Promise<CategoryDocument>;
  toggleSubCategoryStatus(categoryId: string, subCategoryId: string, currentStatus: boolean): Promise<CategoryDocument>;
  deleteCategory(id: string): Promise<void>;
  deleteSubCategory(categoryId: string, subCategoryId: string): Promise<CategoryDocument>;
  updateCourseCount(categoryId: string, subCategoryId: string | null): Promise<void>;
}
