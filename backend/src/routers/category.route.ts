import { Router } from 'express';
import { categoryController } from '@/dependencies/category.di';
import { authenticateToken } from '@/middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes - Admin only
router.post('/', authenticateToken, categoryController.createCategory);
router.post('/subcategory', authenticateToken, categoryController.createSubCategory);
router.put('/:id', authenticateToken, categoryController.updateCategory);
router.put('/:categoryId/subcategory/:subCategoryId', authenticateToken, categoryController.updateSubCategory);
router.patch('/:id/toggle', authenticateToken, categoryController.toggleCategoryStatus);
router.patch('/:categoryId/subcategory/:subCategoryId/toggle', authenticateToken, categoryController.toggleSubCategoryStatus);
router.delete('/:id', authenticateToken, categoryController.deleteCategory);
router.delete('/:categoryId/subcategory/:subCategoryId', authenticateToken, categoryController.deleteSubCategory);

export default router;
