import { ICategoryService, ICategoryCreateDTO, ISubCategoryCreateDTO } from '../interface/category.service.interface';
import { ICategoryRepository } from '@/repositories/interface/category.repository.interface';
import { CategoryDocument } from '@/models/interface/category.model.interface';
import { HttpError } from '@/utils/http-error.utils';
import { HttpStatus } from '@/constants/status.constant';

export class CategoryService implements ICategoryService {
  constructor(private readonly _categoryRepository: ICategoryRepository) {}

  async createCategory(data: ICategoryCreateDTO): Promise<CategoryDocument> {
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

  async createSubCategory(data: ISubCategoryCreateDTO): Promise<CategoryDocument> {
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

  async getAllCategories(): Promise<CategoryDocument[]> {
    try {
      return await this._categoryRepository.find({});
    } catch (err) {
        console.log(err)
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch categories');
    }
  }

  async getCategoryById(id: string): Promise<CategoryDocument> {
    const category = await this._categoryRepository.findById(id);
    if (!category) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Category not found');
    }
    return category;
  }

  async updateCategory(id: string, data: ICategoryCreateDTO): Promise<CategoryDocument> {
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

  async updateSubCategory(categoryId: string, subCategoryId: string, data: ICategoryCreateDTO): Promise<CategoryDocument> {
    const category = await this.getCategoryById(categoryId);
    
    const subCategoryIndex = category.subCategories.findIndex(
      sub => (sub._id).toString() === subCategoryId
    );
    
    if (subCategoryIndex === -1) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Subcategory not found');
    }

    if (data.name !== category.subCategories[subCategoryIndex].name) {
      const existingSubCategory = category.subCategories.find(sub => 
        sub.name === data.name && sub._id.toString() !== subCategoryId
      );
      if (existingSubCategory) {
        throw new HttpError(HttpStatus.CONFLICT, 'Subcategory with this name already exists in this category');
      }
    }

    category.subCategories[subCategoryIndex].name = data.name;
    category.subCategories[subCategoryIndex].isListed = data.isListed;

    return await category.save();
  }

  async toggleCategoryStatus(id: string, currentStatus: boolean): Promise<CategoryDocument> {
    const updated = await this._categoryRepository.updateListingStatus(id, !currentStatus);
    if (!updated) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Category not found');
    }
    return updated;
  }

  async toggleSubCategoryStatus(
    categoryId: string,
    subCategoryId: string,
    currentStatus: boolean
  ): Promise<CategoryDocument> {
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

  async deleteCategory(id: string): Promise<void> {
    const deleted = await this._categoryRepository.findByIdAndDelete(id);
    if (!deleted) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Category not found');
    }
  }

  async deleteSubCategory(categoryId: string, subCategoryId: string): Promise<CategoryDocument> {
    const category = await this.getCategoryById(categoryId);
    
    const subCategoryIndex = category.subCategories.findIndex(
      sub => sub._id.toString() === subCategoryId
    );
    
    if (subCategoryIndex === -1) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Subcategory not found');
    }

    category.subCategories.splice(subCategoryIndex, 1);
    return await category.save();
  }

  async updateCourseCount(categoryId: string, subCategoryId: string | null): Promise<void> {
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
