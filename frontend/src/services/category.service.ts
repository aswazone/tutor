import { axiosInstance } from "@/config/axios.config";
import { ICategory, ICategoryCreateDTO, ISubCategoryCreateDTO } from "@/types/services.types";



class CategoryService {
  async getAllCategories() {
    const response = await axiosInstance.get<ICategory[]>('/api/v1/category');
    return response.data;
  }

  async getCategoryById(id: string) {
    const response = await axiosInstance.get<ICategory>(`/api/v1/category/${id}`);
    return response.data;
  }

  async createCategory(data: ICategoryCreateDTO) {
    const response = await axiosInstance.post<ICategory>('/api/v1/category', data);
    return response.data;
  }

  async createSubCategory(data: ISubCategoryCreateDTO) {
    const response = await axiosInstance.post<ICategory>('/api/v1/category/subcategory', data);
    return response.data;
  }

  async updateCategory(id: string, data: ICategoryCreateDTO) {
    const response = await axiosInstance.put<ICategory>(`/api/v1/category/${id}`, data);
    return response.data;
  }

  async updateSubCategory(categoryId: string, subCategoryId: string, data: ICategoryCreateDTO) {
    const response = await axiosInstance.put<ICategory>(
      `/api/v1/category/${categoryId}/subcategory/${subCategoryId}`,
      data
    );
    return response.data;
  }

  async toggleCategoryStatus(id: string, currentStatus: boolean) {
    const response = await axiosInstance.patch<ICategory>(
      `/api/v1/category/${id}/toggle`,
      { currentStatus }
    );
    return response.data;
  }

  async toggleSubCategoryStatus(categoryId: string, subCategoryId: string, currentStatus: boolean) {
    const response = await axiosInstance.patch<ICategory>(
      `/api/v1/category/${categoryId}/subcategory/${subCategoryId}/toggle`,
      { currentStatus }
    );
    return response.data;
  }

  async deleteCategory(id: string) {
    await axiosInstance.delete(`/api/v1/category/${id}`);
  }

  async deleteSubCategory(categoryId: string, subCategoryId: string) {
    const response = await axiosInstance.delete<ICategory>(
      `/api/v1/category/${categoryId}/subcategory/${subCategoryId}`
    );
    return response.data;
  }
}

export const categoryService = new CategoryService();
