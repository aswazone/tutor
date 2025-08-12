import { IAdminService } from "../interface/admin.service.interface";
import { UserRole } from "@/types/user.type";
import { IAdminRepository } from "@/repositories/interface/admin.repository.interface";
import { IUserRepository } from "@/repositories/interface/user.repository.interface";
import { ICourseRepository } from "@/repositories/interface/course.repository.interface";
import { IOrderRepository } from "@/repositories/interface/order.repository.interface";
import { HttpError } from "@/utils/http-error.utils";
import { HttpStatus } from "@/constants/status.constant";
import { toAdminCourseDTOs, toAdminUserDTOs } from "@/mapper/admin.mapper";

export interface RevenueData {
  courseTitle: string
  tutorName: string
  studentName: string
  studentEmail: string
  amount: number
  paymentDate: Date
  status: string
}
export class AdminService implements IAdminService {

    constructor(
        private readonly _adminRepository:IAdminRepository,
        private readonly _userRepository:IUserRepository,
        private readonly _courseRepository:ICourseRepository,
        private readonly _orderRepository:IOrderRepository
    ) {}

    getAllTutors = async (page: number, limit: number,search: string, tab: string) => {
        const { data , total} = await this._adminRepository.findTutorsForAdmin(page, limit,search, tab);
        return {data:toAdminUserDTOs(data), total};
    }
    getAllStudents = async (page: number, limit: number,search: string) => {
        const { data , total} = await this._adminRepository.findStudentsForAdmin(page, limit,search);
        return {data:toAdminUserDTOs(data), total};
    }
    getAllCourses = async (page: number, limit: number,search: string, tab: string) => {
        const { data, total } =  await this._courseRepository.findCoursesForAdmin(page, limit, search, tab);
        return { data:toAdminCourseDTOs(data), total };
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

    getRevenue = async (page: number, limit: number): Promise<RevenueData[]> => {

        const orders = await this._orderRepository.findAllOrders(page, limit);
        const tutors = await this._adminRepository.findAllUsers(UserRole.TUTOR);


        if (!orders) throw new HttpError(HttpStatus.NOT_FOUND, 'Order not found');

        // console.log(orders, 'orders');
        
        const insight: RevenueData[] = orders.map((order) => ({
            courseTitle: order.courseTitle,
            tutorName: order.tutorName,
            tutorEmail: tutors.find((tutor) => tutor.userName === order.tutorName)?.userEmail || '',
            studentName: order.userName || '',
            studentEmail: order.userEmail || '',
            amount: Number(order.coursePricing) || 0,
            paymentDate: order.orderDate || '',
            status: 'completed',
        }));

        console.log(insight, 'insight');
        return insight;

    }
    
}