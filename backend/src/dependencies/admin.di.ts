import { AdminController } from "@/controllers/implements/admin.controller";
import { AdminService } from "@/services/implements/admin.service";
import { UserRepository } from "@/repositories/implements/user.repository";
import { AdminRepository } from "@/repositories/implements/admin.repository";
import { CourseRepository } from "@/repositories/implements/course.repository";
import { OrderRepository } from "@/repositories/implements/order.repository";

export const adminController = 
    new AdminController(
        new AdminService(
            new AdminRepository(),
            new UserRepository(),
            new CourseRepository(),
            new OrderRepository()
        )
    );