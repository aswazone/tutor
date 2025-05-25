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


export interface SubCategoryDTO {
  id: string;
  label: string;
}

export interface CategoryDTO {
  id: string;
  label: string;
  subcategories: SubCategoryDTO[];
}


