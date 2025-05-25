import { CourseModelIF } from "@/models/interface/course.model.interface";
import { UserModelIF } from "@/models/interface/user.model.interface";

export interface AdminServiceIF {
    getAllTutors(): Promise<UserModelIF[]>
    getAllStudents(): Promise<UserModelIF[]>
    getAllCourses(): Promise<CourseModelIF[]>
    toggleUserStatus(id:string,status:string): Promise<UserModelIF | null>;
    toggleCourseStatus(id:string,status:string): Promise<CourseModelIF | null>;
}