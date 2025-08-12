import { Request, Response, NextFunction } from 'express';
import { ICategoryController } from '../interfaces/category.controller.interface';
import { ICategoryService } from '@/services/interface/category.service.interface';
import { HttpStatus } from '@/constants/status.constant';

export class CategoryController implements ICategoryController {
  constructor(private readonly _categoryService: ICategoryService) {}

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, isListed } = req.body;
      const category = await this._categoryService.createCategory({ name, isListed });
      res.status(HttpStatus.CREATED).json(category);
    } catch (error) {
      next(error);
    }
  };

  createSubCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, isListed, parentId } = req.body;
      const category = await this._categoryService.createSubCategory({ name, isListed, parentId });
      res.status(HttpStatus.CREATED).json(category);
    } catch (error) {
      next(error);
    }
  };

  getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, search } = req.query;
      const categories = await this._categoryService.getAllCategories(Number(page),Number(limit),search as string);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };
  listAllCategoriesOnUserSide = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this._categoryService.listAllCategoriesOnUserSide();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this._categoryService.getCategoryById(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, isListed } = req.body;
      const category = await this._categoryService.updateCategory(id, { name, isListed });
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  updateSubCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { categoryId, subCategoryId } = req.params;
      const { name, isListed } = req.body;
      const category = await this._categoryService.updateSubCategory(
        categoryId,
        subCategoryId,
        { name, isListed }
      );
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  toggleCategoryStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { currentStatus } = req.body;
      const category = await this._categoryService.toggleCategoryStatus(id, currentStatus);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  toggleSubCategoryStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { categoryId, subCategoryId } = req.params;
      const { currentStatus } = req.body;
      const category = await this._categoryService.toggleSubCategoryStatus(
        categoryId,
        subCategoryId,
        currentStatus
      );
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._categoryService.deleteCategory(id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };

  deleteSubCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { categoryId, subCategoryId } = req.params;
      const category = await this._categoryService.deleteSubCategory(categoryId, subCategoryId);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };
}
