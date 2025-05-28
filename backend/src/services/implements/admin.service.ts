import { IAdminService } from "../interface/admin.service.interface";
import { UserRole } from "@/types/user.type";
import { IAdminRepository } from "@/repositories/interface/admin.repository.interface";
import { IUserRepository } from "@/repositories/interface/user.repository.interface";
import { ICourseRepository } from "@/repositories/interface/course.repository.interface";

export class AdminService implements IAdminService {

    constructor(
        private readonly _adminRepository:IAdminRepository,
        private readonly _userRepository:IUserRepository,
        private readonly _courseRepository:ICourseRepository
    ) {}

    getAllTutors = async () => this._adminRepository.findAllUsers(UserRole.TUTOR);
    getAllStudents = async () => this._adminRepository.findAllUsers(UserRole.STUDENT)
    getAllCourses = async () => {
    const courses = await this._courseRepository.findAllCourses(
        { isDeleted: false },
        { 
            path: 'tutor',
            select: 'userName'
        }
    );
    return courses;
}
    
    toggleUserStatus = async (id:string,status:string) => {
        console.log('----------------------------------------------------',status);
        const booleanStatus = status === 'true';
        return await this._userRepository.findByIdAndUpdate(id,{isActive:!booleanStatus});
    }
    
    toggleCourseStatus = async (id:string,status:string) => {
        console.log('----------------------------------------------------',status);
        const booleanStatus = status === 'true';
        return await this._courseRepository.findByIdAndUpdate(id,{isActive:!booleanStatus});
    }
    
}