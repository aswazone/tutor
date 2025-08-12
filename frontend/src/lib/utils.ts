import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from "slugify";
import { CategoryDTO, ICategory } from "@/types/category.type";
import { categoryService } from "@/services/category.service";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

  export const flattenCategories = async () => {
      try {
        const data = await categoryService.listAllCategoriesOnUserSide();

        console.log(data, 'categories-utils');

        if (data) {
          const mapCategoryToDTO = (category: ICategory): CategoryDTO => ({
            id: slugify(category.name, { lower: true }),       // Slugified main category ID
            label: category.name,                              // Display name
            subcategories: category.subCategories
              .filter((sub) => sub.isListed)              // Only include listed subcategories
              .map((sub) => ({
                id: slugify(sub.name, { lower: true }),        // Slugified subcategory ID
                label: sub.name                                // Display name
              }))
          });

          const categories: CategoryDTO[] = data.filter((category: ICategory) => category.isListed).map(mapCategoryToDTO);
          return categories;

        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } 
    };


    