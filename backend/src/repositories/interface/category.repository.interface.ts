import { ICategoryModel } from '@/models/interface/category.model.interface';
import { IBaseRepository } from './base.repository.interface';
import { FindCategoriesForAdminResult } from '@/types/admin.type';

export interface ICategoryRepository extends IBaseRepository<ICategoryModel> {
  findCategoriesForUsers():Promise<ICategoryModel[]>
  findCategoriesForAdmin(page:number,limit:number,search:string):Promise<FindCategoriesForAdminResult>
  findByName(name: string): Promise<ICategoryModel | null>;
  updateCourseCount(categoryId: string, increment: boolean): Promise<ICategoryModel | null>;
  updateSubCategoryCourseCount(categoryId: string, subCategoryId: string, increment: boolean): Promise<ICategoryModel | null>;
  updateListingStatus(categoryId: string, isListed: boolean): Promise<ICategoryModel | null>;
  updateSubCategoryListingStatus(categoryId: string, subCategoryId: string, isListed: boolean): Promise<ICategoryModel | null>;
}
