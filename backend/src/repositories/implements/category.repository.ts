import { BaseRepository } from '@/repositories/base.repository';
import { ICategoryModel } from '@/models/interface/category.model.interface';
import { ICategoryRepository } from '../interface/category.repository.interface';
import { CategoryModel } from '@/models/implements/category.model';
import { HttpError } from '@/utils/http-error.utils';
import { HttpStatus } from '@/constants/status.constant';
import { FilterQuery, Types } from 'mongoose';
import { FindCategoriesForAdminResult } from '@/types/admin.type';

export class CategoryRepository extends BaseRepository<ICategoryModel> implements ICategoryRepository {
  constructor() {
    super(CategoryModel);
  }

  async findCategoriesForAdmin(page: number, limit: number, search: string): Promise<FindCategoriesForAdminResult> {
    const filter: FilterQuery<ICategoryModel> = {};

    if(search){
      filter.$or = [
        {name:{ $regex: search, $options: 'i' }},
        {'subCategories.name':{ $regex: search, $options: 'i' }}
      ]
    }
    
    try {
      const data:ICategoryModel[] = await this.model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      const total:number = await this.model.countDocuments(filter);

      return {data, total}
    } catch (err) {
        console.log(err)
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch categories');
    }
  }

  async findCategoriesForUsers(): Promise<ICategoryModel[]> {
    try {
      return await this.model.find({ isListed: true });
    } catch (err) {
        console.log(err)
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch categories');
    }
  }

  async findByName(name: string): Promise<ICategoryModel | null> {
    try {
      return await this.findOne({ name });
    } catch (err) {
        console.log(err)
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch category');
    }
  }

  async updateCourseCount(categoryId: string, increment: boolean): Promise<ICategoryModel | null> {
    try {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid category ID');
      }
      return await this.findByIdAndUpdate(
        categoryId,
        { $inc: { coursesCount: increment ? 1 : -1 } },
        { new: true }
      );
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update course count');
    }
  }

  async updateSubCategoryCourseCount(categoryId: string, subCategoryId: string, increment: boolean): Promise<ICategoryModel | null> {
    try {
      if (!Types.ObjectId.isValid(categoryId) || !Types.ObjectId.isValid(subCategoryId)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid category or subcategory ID');
      }
      return await this.findByIdAndUpdate(
        categoryId,
        { 
          $inc: { 
            'subCategories.$[elem].coursesCount': increment ? 1 : -1 
          } 
        },
        { 
          arrayFilters: [{ 'elem._id': subCategoryId }],
          new: true
        }
      );
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update subcategory course count');
    }
  }

  async updateListingStatus(categoryId: string, isListed: boolean): Promise<ICategoryModel | null> {
    try {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid category ID');
      }
      return await this.findByIdAndUpdate(
        categoryId,
        { isListed },
        { new: true }
      );
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update listing status');
    }
  }

  async updateSubCategoryListingStatus(categoryId: string, subCategoryId: string, isListed: boolean): Promise<ICategoryModel | null> {
    try {
      if (!Types.ObjectId.isValid(categoryId) || !Types.ObjectId.isValid(subCategoryId)) {
        throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid category or subcategory ID');
      }
      return await this.findByIdAndUpdate(
        categoryId,
        { 
          'subCategories.$[elem].isListed': isListed 
        },
        { 
          arrayFilters: [{ 'elem._id': new Types.ObjectId(subCategoryId) }],
          new: true
        }
      );
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update subcategory listing status');
    }
  }
}
