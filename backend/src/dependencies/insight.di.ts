import { InsightController } from "@/controllers/implements/insight.controller";
import { CourseRepository } from "@/repositories/implements/course.repository";
import { CourseProgressRepository } from "@/repositories/implements/courseProgress.repository";
import { StudentCoursesRepository } from "@/repositories/implements/studentCourses.repository";
import { UserRepository } from "@/repositories/implements/user.repository";
import { InsightService } from "@/services/implements/insight.service";


export const insightController = new InsightController(
    new InsightService(
        new CourseRepository(),
        new CourseProgressRepository(),
        new StudentCoursesRepository(),
        new UserRepository()
    ));