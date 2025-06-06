import { StudentCoursesModel } from "@/models/implements/studentCourses.model";
import { IStudentCoursesRepository } from "../interface/studentCourses.repository.interface";
import { BaseRepository } from "../base.repository";
import { IStudentCoursesModel } from "@/models/interface/studentCourses.model.interface";

export class StudentCoursesRepository extends BaseRepository<IStudentCoursesModel> implements IStudentCoursesRepository{
    constructor(){
        super(StudentCoursesModel);
    }

    async addCourseToStudent(userId: string, courseId: string): Promise<void> {
        await this.model.create({userId, courseId});
    }
    async removeCourseFromStudent(userId: string, courseId: string): Promise<void> {
        await this.model.deleteOne({userId, courseId});
    }
    async getStudentCourse(userId: string): Promise<IStudentCoursesModel | null> {
        return this.model.findOne({userId});
    }
}