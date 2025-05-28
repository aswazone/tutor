import { ICourseModel } from "@/models/interface/course.model.interface";
import { IUserModel } from "@/models/interface/user.model.interface";

export interface IAdminService {
    getAllTutors(): Promise<IUserModel[]>
    getAllStudents(): Promise<IUserModel[]>
    getAllCourses(): Promise<ICourseModel[]>
    toggleUserStatus(id:string,status:string): Promise<IUserModel | null>;
    toggleCourseStatus(id:string,status:string): Promise<ICourseModel | null>;
}