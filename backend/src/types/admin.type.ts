import { ICategoryModel } from "@/models/interface/category.model.interface";
import { ICourseModel } from "@/models/interface/course.model.interface";
import { IUserModel } from "@/models/interface/user.model.interface";

export interface FindCoursesForAdminResult {
  data: ICourseModel[];
  total: number;
}

export interface FindUsersForAdminResult {
  data: IUserModel[];
  total: number;
}

export interface FindCategoriesForAdminResult {
  data: ICategoryModel[]
  total: number;
}