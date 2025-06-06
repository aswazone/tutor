import { StudentCoursesModel } from "@/models/implements/studentCourses.model";
import { IStudentCoursesRepository } from "../interface/studentCourses.repository.interface";
import { BaseRepository } from "../base.repository";
import { IStudentCoursesModel } from "@/models/interface/studentCourses.model.interface";

export class StudentCoursesRepository extends BaseRepository<IStudentCoursesModel> implements IStudentCoursesRepository{
    constructor(){
        super(StudentCoursesModel);
    }


    async getStudentCourses(userId: string): Promise<IStudentCoursesModel | null> {
        return this.model.findOne({studentId:userId});
    }
}