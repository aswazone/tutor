import { IStudentCoursesModel } from "@/models/interface/studentCourses.model.interface"
import { IBaseRepository } from "./base.repository.interface"

export interface IStudentCoursesRepository extends IBaseRepository<IStudentCoursesModel> {
    getStudentCourses(userId: string): Promise<IStudentCoursesModel | null>
}