import { ICourseModel } from "@/models/interface/course.model.interface";
import { IUserModel } from "@/models/interface/user.model.interface";
import { RevenueData } from "../implements/admin.service";
import { IAdminCourseDTO, IAdminUserDTO } from "@/mapper/admin.mapper";

export interface IAdminService {
    getAllTutors(page: number, limit: number, search: string, tab: string): Promise<{data:IAdminUserDTO[], total: number}>
    getAllStudents(page: number, limit: number, search: string): Promise<{data:IAdminUserDTO[], total: number}>
    getAllCourses(page: number, limit: number, search: string, tab: string): Promise<{data:IAdminCourseDTO[], total: number}>
    toggleUserStatus(id:string,status:string): Promise<IUserModel | null>;
    toggleCourseStatus(id:string,status:string): Promise<ICourseModel | null>;
    getRevenue(page: number, limit: number): Promise<RevenueData[]>
}