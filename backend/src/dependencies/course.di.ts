import { CourseController } from "@/controllers/implements/course.controller";
import { CourseRepository } from "@/repositories/implements/course.repository";
import { StudentCoursesRepository } from "@/repositories/implements/studentCourses.repository";
import { UserRepository } from "@/repositories/implements/user.repository";
import { CourseService } from "@/services/implements/course.service";

export const courseController = new CourseController(new CourseService(
    new CourseRepository(), 
    new UserRepository(), 
    new StudentCoursesRepository()
));
