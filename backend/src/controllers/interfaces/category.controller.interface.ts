import { Request, Response, NextFunction } from 'express';

export interface CategoryControllerIF {
  createCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  createSubCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateSubCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleCategoryStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleSubCategoryStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteSubCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
}
