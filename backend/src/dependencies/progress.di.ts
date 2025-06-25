import { CourseProgressController } from "@/controllers/implements/courseProgress.controller";
import { CourseRepository } from "@/repositories/implements/course.repository";
import { CourseProgressRepository } from "@/repositories/implements/courseProgress.repository";
import { StudentCoursesRepository } from "@/repositories/implements/studentCourses.repository";
import { CourseProgressService } from "@/services/implements/courseProgress.service";

export const courseProgressController = new CourseProgressController(new CourseProgressService(
    new CourseRepository(),
    new CourseProgressRepository(),
    new StudentCoursesRepository()
));

