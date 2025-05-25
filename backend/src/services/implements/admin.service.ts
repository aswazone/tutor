import { AdminServiceIF } from "../interface/admin.service.interface";
import { UserRole } from "@/types/user.type";
import { AdminRepositoryIF } from "@/repositories/interface/admin.repository.interface";
import { UserRepositoryIF } from "@/repositories/interface/user.repository.interface";
import { CourseRepositoryIF } from "@/repositories/interface/course.repository.interface";

export class AdminService implements AdminServiceIF {

    constructor(
        private readonly _adminRepository:AdminRepositoryIF,
        private readonly _userRepository:UserRepositoryIF,
        private readonly _courseRepository:CourseRepositoryIF
    ) {}

    getAllTutors = async () => this._adminRepository.findAll(UserRole.TUTOR);
    getAllStudents = async () => this._adminRepository.findAll(UserRole.STUDENT);
    getAllCourses = async () => this._courseRepository.findAll({isDeleted:false});
    
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