import { IAdminCategoryDTO } from '@/mapper/admin.mapper';
import { ICategoryModel } from '@/models/interface/category.model.interface';
import { ICategoryCreateDTO, ISubCategoryCreateDTO } from '@/types/category.type';

export interface ICategoryService {
  createCategory(data: ICategoryCreateDTO): Promise<ICategoryModel>;
  createSubCategory(data: ISubCategoryCreateDTO): Promise<ICategoryModel>;
  listAllCategoriesOnUserSide(): Promise<IAdminCategoryDTO[]>;
  getAllCategories(page: number, limit: number, search: string): Promise<{data:IAdminCategoryDTO[],total:number}>;
  getCategoryById(id: string): Promise<ICategoryModel>;
  updateCategory(id: string, data: ICategoryCreateDTO): Promise<ICategoryModel>;
  updateSubCategory(categoryId: string, subCategoryId: string, data: ICategoryCreateDTO): Promise<ICategoryModel>;
  toggleCategoryStatus(id: string, currentStatus: boolean): Promise<ICategoryModel>;
  toggleSubCategoryStatus(categoryId: string, subCategoryId: string, currentStatus: boolean): Promise<ICategoryModel>;
  deleteCategory(id: string): Promise<void>;
  deleteSubCategory(categoryId: string, subCategoryId: string): Promise<ICategoryModel>;
  updateCourseCount(categoryId: string, subCategoryId: string | null): Promise<void>;
}
