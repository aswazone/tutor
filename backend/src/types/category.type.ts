
export interface ICategoryCreateDTO {
  name: string;
  isListed: boolean;
}

export interface ISubCategoryCreateDTO extends ICategoryCreateDTO {
  parentId: string;
}