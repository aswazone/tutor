import { IOrderService } from "../interface/order.service.interface";
import { capturePaypalPayment, createPaypalOrder } from "@/utils/paypal.utils";
import { IOrderDataDTO } from "@/types/course.type";
import { IOrderRepository } from "@/repositories/interface/order.repository.interface";
import { IUserRepository } from "@/repositories/interface/user.repository.interface";
import { IStudentCoursesRepository } from "@/repositories/interface/studentCourses.repository.interface";
import { StudentCourses } from "@/schema/studentCourses.schema";
import { ICourseRepository } from "@/repositories/interface/course.repository.interface";
import { IOrderModel } from "@/models/interface/order.model.interface";

interface IOrderDTO{
    id: string;
}
 export type approvedPayment ={
    status: string
}

export type OnApproveData = {
    orderID: string;
    payerID?: string | null;
    paymentID?: string | null;
};

export class OrderService implements IOrderService {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _orderRepository:IOrderRepository,
        private readonly _studentCourseRepository: IStudentCoursesRepository,
        private readonly _courseRepository: ICourseRepository
    ){}

    createOrder = async (userId: string, orderData: IOrderDataDTO): Promise<{paypalId: string, orderId: string}> => {

        const user = await this._userRepository.findUserById(userId);
        if(!user) throw new Error('User not found');

        // console.log(user,'user');

        const order = await createPaypalOrder(orderData) as IOrderDTO;
        if(!order) throw new Error('Failed to create order');

        const orderPayload = {
            userId: user._id as string,
            userName: user.name,
            userEmail: user.userEmail,
            orderStatus: 'PENDING',
            paymentStatus: 'PENDING',
            paymentMethod: 'PAYPAL',
            orderDate: new Date(),
            paymentId: '',
            payerId: '',
            tutorId: orderData.tutor?._id,
            tutorName: orderData.tutor?.name,
            courseImage: orderData.thumbnailKey,
            courseTitle: orderData.title,
            courseId: orderData._id as string,
            coursePricing: orderData.pricing
        }

        console.log(orderPayload,'order payload');

        const createdOrder = await this._orderRepository.createOrder(orderPayload);
        if(!createdOrder) throw new Error('Failed to create order');

        console.log(createdOrder,'created order');
        return {paypalId: order?.id, orderId: createdOrder?._id as string};
    }

    capturePayment = async (orderItemId: string, data: OnApproveData) : Promise<IOrderModel | null> => {

        const {payerID, paymentID, orderID} = data;

        const approvedPayment : approvedPayment = await capturePaypalPayment(orderID);
        console.log(approvedPayment,'approved payment',data);
        
        if(!approvedPayment) throw new Error('Failed to capture payment');

        const orderExist = await this._orderRepository.findOrderById(orderItemId);
        if(!orderExist) return null;

        if(approvedPayment?.status === 'COMPLETED'){
            
            const update = {
                paymentId: paymentID ?? '',
                payerId: payerID ?? '',
                paymentStatus: 'PAID',
                orderStatus: paymentID && payerID ? 'COMPLETED' : 'PENDING'
            }

            const updatedOrder = await this._orderRepository.updateOrder(orderItemId, update);
            if(!updatedOrder) throw new Error('Failed to update order !');

            const studentCourses = await StudentCourses.findOne({
                studentId: updatedOrder.userId as string
            })
            
            if(studentCourses){

                studentCourses?.courses.push({
                    courseId: updatedOrder.courseId as string,
                    title: updatedOrder.courseTitle as string,  
                    tutorId: updatedOrder.tutorId as string,
                    tutorName: updatedOrder.tutorName as string,
                    dateOfPurchase: updatedOrder.orderDate as Date,
                    courseImage: updatedOrder.courseImage as string 
                })

                await studentCourses.save();

            }else{
                const newStudentCourse = new StudentCourses({
                    studentId: updatedOrder.userId as string,
                    courses: [
                        {
                            courseId: updatedOrder.courseId as string,
                            title: updatedOrder.courseTitle as string,
                            tutorId: updatedOrder.tutorId as string,
                            tutorName: updatedOrder.tutorName as string,
                            dateOfPurchase: updatedOrder.orderDate as Date,
                            courseImage: updatedOrder.courseImage as string
                        }
                    ]
                })

                await newStudentCourse.save();
            }


          const updatedCourse =  await this._courseRepository.findByIdAndUpdate(updatedOrder.courseId as string,{
                $addToSet: {
                    students:{
                        studentId: updatedOrder.userId as string,
                        studentName: updatedOrder.userName as string,
                        studentEmail: updatedOrder.userEmail as string,
                        paidAmount: updatedOrder.coursePricing as string
                    }
                }
            });
            
        console.log(updatedCourse,'updated course-after payment');

            return updatedOrder;

        }

        return null;
    }
}