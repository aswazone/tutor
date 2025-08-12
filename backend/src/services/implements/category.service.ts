import { ICategoryService} from '../interface/category.service.interface';
import { ICategoryRepository } from '@/repositories/interface/category.repository.interface';
import { ICategoryModel } from '@/models/interface/category.model.interface';
import { HttpError } from '@/utils/http-error.utils';
import { HttpStatus } from '@/constants/status.constant';
import { Types } from 'mongoose';
import { ICategoryCreateDTO, ISubCategoryCreateDTO } from '@/types/category.type';
import { toAdminCategoryDTOs } from '@/mapper/admin.mapper';

export class CategoryService implements ICategoryService {
  constructor(private readonly _categoryRepository: ICategoryRepository) {}

  createCategory = async (data: ICategoryCreateDTO): Promise<ICategoryModel> => {
    try {
      const existingCategory = await this._categoryRepository.findByName(data.name);
      if (existingCategory) {
        throw new HttpError(HttpStatus.CONFLICT, 'Category with this name already exists');
      }

      return await this._categoryRepository.create(data);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create category');
    }
  }

  createSubCategory = async (data: ISubCategoryCreateDTO): Promise<ICategoryModel> => {
    try {
      const category = await this._categoryRepository.findById(data.parentId);
      if (!category) {
        throw new HttpError(HttpStatus.NOT_FOUND, 'Parent category not found');
      }

      const existingSubCategory = category.subCategories.find(sub => sub.name === data.name);
      if (existingSubCategory) {
        throw new HttpError(HttpStatus.CONFLICT, 'Subcategory with this name already exists in this category');
      }

      category.subCategories.push({
        _id: new Types.ObjectId(),
        name: data.name,
        isListed: data.isListed,
        coursesCount: 0,
        parentId: category._id
      });

      return await category.save();
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create subcategory');
    }
  }

  getAllCategories = async (page: number, limit: number, search: string) =>{
    try {
      const {data,total} = await this._categoryRepository.findCategoriesForAdmin(page,limit,search);
      return {data:toAdminCategoryDTOs(data),total};
    } catch (err) {
        console.log(err)
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch categories');
    }
  }
  listAllCategoriesOnUserSide = async () => {
    try {
      const categories = await this._categoryRepository.findCategoriesForUsers();
      return toAdminCategoryDTOs(categories);
    } catch (err) {
        console.log(err)
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch categories');
    }
  }

   getCategoryById = async (id: string): Promise<ICategoryModel> => {
    const category = await this._categoryRepository.findById(id);
    if (!category) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Category not found');
    }
    return category;
  }

  updateCategory = async (id: string, data: ICategoryCreateDTO): Promise<ICategoryModel> => {
    const category = await this.getCategoryById(id);
    
    if (data.name !== category.name) {
      const existingCategory = await this._categoryRepository.findByName(data.name);
      if (existingCategory && (existingCategory._id as string).toString() !== id) {
        throw new HttpError(HttpStatus.CONFLICT, 'Category with this name already exists');
      }
    }

    const updated = await this._categoryRepository.findByIdAndUpdate(
      id,
      { name: data.name, isListed: data.isListed },
      { new: true }
    );

    if (!updated) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Category not found');
    }

    return updated;
  }

  updateSubCategory = async (categoryId: string, subCategoryId: string, data: ICategoryCreateDTO): Promise<ICategoryModel> => {
    const category = await this.getCategoryById(categoryId);
    
    const subCategoryIndex = category.subCategories.findIndex(
      sub => (sub._id as string).toString() === subCategoryId
    );
    
    if (subCategoryIndex === -1) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Subcategory not found');
    }

    if (data.name !== category.subCategories[subCategoryIndex].name) {
      const existingSubCategory = category.subCategories.find(sub => 
        sub.name === data.name && (sub._id as string).toString() !== subCategoryId
      );
      if (existingSubCategory) {
        throw new HttpError(HttpStatus.CONFLICT, 'Subcategory with this name already exists in this category');
      }
    }

    category.subCategories[subCategoryIndex].name = data.name;
    category.subCategories[subCategoryIndex].isListed = data.isListed;

    return await category.save();
  }

  toggleCategoryStatus = async (id: string, currentStatus: boolean): Promise<ICategoryModel> => {
    const updated = await this._categoryRepository.updateListingStatus(id, !currentStatus);
    if (!updated) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Category not found');
    }
    return updated;
  }

  toggleSubCategoryStatus = async (
    categoryId: string,
    subCategoryId: string,
    currentStatus: boolean
  ): Promise<ICategoryModel> => {
    const updated = await this._categoryRepository.updateSubCategoryListingStatus(
      categoryId,
      subCategoryId,
      !currentStatus
    );
    if (!updated) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Category or subcategory not found');
    }
    return updated;
  }

  deleteCategory = async (id: string): Promise<void> => {
    const deleted = await this._categoryRepository.findByIdAndDelete(id);
    if (!deleted) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Category not found');
    }
  }

  deleteSubCategory = async (categoryId: string, subCategoryId: string): Promise<ICategoryModel> => {
    const category = await this.getCategoryById(categoryId);
    
    const subCategoryIndex = category.subCategories.findIndex(
      sub => (sub._id as string).toString() === subCategoryId
    );
    
    if (subCategoryIndex === -1) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Subcategory not found');
    }

    category.subCategories.splice(subCategoryIndex, 1);
    return await category.save();
  }

   updateCourseCount = async (categoryId: string, subCategoryId: string | null): Promise<void> => {
    try {
      await this._categoryRepository.updateCourseCount(categoryId, true);
      
      if (subCategoryId) {
        await this._categoryRepository.updateSubCategoryCourseCount(categoryId, subCategoryId, true);
      }
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update course count');
    }
  }
}
