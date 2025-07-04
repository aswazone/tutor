export interface ICategory {
  _id: string;
  name: string;
  isListed: boolean;
  coursesCount: number;
  subCategories: Array<{
    _id: string;
    name: string;
    isListed: boolean;
    coursesCount: number;
    parentId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryCreateDTO {
  name: string;
  isListed: boolean;
}

export interface ISubCategoryCreateDTO extends ICategoryCreateDTO {
  parentId: string;
}

export interface UploadResponse {
  url: string;
  key: string;
}