import { IStudentCoursesModel } from "@/models/interface/studentCourses.model.interface"
import { IBaseRepository } from "./base.repository.interface"
import { FindCoursesByStudentResultAfterAggregation } from "@/types/course.type"

export interface IStudentCoursesRepository extends IBaseRepository<IStudentCoursesModel> {
    getAllStudentCourses(): Promise<IStudentCoursesModel[]>
    getStudentOwnedCourses(userId: string, page: number, limit: number, search: string): Promise<FindCoursesByStudentResultAfterAggregation>
    getStudentCourses(userId: string): Promise<IStudentCoursesModel | null>
}