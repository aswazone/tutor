import { CourseController } from "@/controllers/implements/course.controller";
import { CourseRepository } from "@/repositories/implements/course.repository";
import { CourseService } from "@/services/implements/course.service";

export const courseController = new CourseController(new CourseService(new CourseRepository()));
