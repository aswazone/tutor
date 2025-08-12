import { Router } from 'express';
import { categoryController } from '@/dependencies/category.di';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { checkRole } from '@/middlewares/checkrole.middleware';

const router = Router();

// Public routes
router.get('/admin', categoryController.getAllCategories);
router.get('/', categoryController.listAllCategoriesOnUserSide);
router.get('/:id', categoryController.getCategoryById);

// Protected routes - Admin only
router.post('/', authenticateToken,checkRole("admin"), categoryController.createCategory);
router.post('/subcategory', authenticateToken,checkRole("admin"), categoryController.createSubCategory);
router.put('/:id', authenticateToken,checkRole("admin"), categoryController.updateCategory);
router.put('/:categoryId/subcategory/:subCategoryId', authenticateToken,checkRole("admin"), categoryController.updateSubCategory);
router.patch('/:id/toggle', authenticateToken,checkRole("admin"), categoryController.toggleCategoryStatus);
router.patch('/:categoryId/subcategory/:subCategoryId/toggle', authenticateToken,checkRole("admin"), categoryController.toggleSubCategoryStatus);
router.delete('/:id', authenticateToken,checkRole("admin"), categoryController.deleteCategory);
router.delete('/:categoryId/subcategory/:subCategoryId', authenticateToken,checkRole("admin"), categoryController.deleteSubCategory);

export default router;
