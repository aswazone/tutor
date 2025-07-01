import { ICourseModel } from "@/models/interface/course.model.interface";
import { IUserModel } from "@/models/interface/user.model.interface";
import { RevenueData } from "../implements/admin.service";

export interface IAdminService {
    getAllTutors(): Promise<IUserModel[]>
    getAllStudents(): Promise<IUserModel[]>
    getAllCourses(): Promise<ICourseModel[]>
    toggleUserStatus(id:string,status:string): Promise<IUserModel | null>;
    toggleCourseStatus(id:string,status:string): Promise<ICourseModel | null>;
    getRevenue(page: number, limit: number): Promise<RevenueData[]>
}