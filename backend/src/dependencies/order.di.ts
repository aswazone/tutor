import { OrderController } from "@/controllers/implements/order.controller";
import { CourseRepository } from "@/repositories/implements/course.repository";
import { OrderRepository } from "@/repositories/implements/order.repository";
import { StudentCoursesRepository } from "@/repositories/implements/studentCourses.repository";
import { UserRepository } from "@/repositories/implements/user.repository";
import { OrderService } from "@/services/implements/order.service";

export const orderController = new OrderController(new OrderService(
    new UserRepository(), 
    new OrderRepository(), 
    new StudentCoursesRepository(),
    new CourseRepository()
));