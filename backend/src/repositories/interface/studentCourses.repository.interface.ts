import { IStudentCoursesModel } from "@/models/interface/studentCourses.model.interface"
import { IBaseRepository } from "./base.repository.interface"

export interface IStudentCoursesRepository extends IBaseRepository<IStudentCoursesModel> {
    addCourseToStudent(userId: string, courseId: string): Promise<void>
    removeCourseFromStudent(userId: string, courseId: string): Promise<void>
    getStudentCourse(userId: string): Promise<IStudentCoursesModel | null>
}