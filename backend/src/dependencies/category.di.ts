import { CategoryController } from '@/controllers/implements/category.controller';
import { CategoryService } from '@/services/implements/category.service';
import { CategoryRepository } from '@/repositories/implements/category.repository';

export const categoryController = new CategoryController(
  new CategoryService(
    new CategoryRepository()
  )
);
