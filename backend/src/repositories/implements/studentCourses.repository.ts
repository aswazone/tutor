import { StudentCoursesModel } from "@/models/implements/studentCourses.model";
import { IStudentCoursesRepository } from "../interface/studentCourses.repository.interface";
import { BaseRepository } from "../base.repository";
import { IStudentCoursesModel } from "@/models/interface/studentCourses.model.interface";

export class StudentCoursesRepository extends BaseRepository<IStudentCoursesModel> implements IStudentCoursesRepository{
    constructor(){
        super(StudentCoursesModel);
    }

    async getAllStudentCourses(): Promise<IStudentCoursesModel[]> {
        return this.model.find();
    }

    async getStudentCourses(userId: string): Promise<IStudentCoursesModel | null> {
        const studentCourses = await this.model.findOne({ studentId: userId });
        if (!studentCourses) return null;
    
        studentCourses.courses.sort(
            (a, b) => new Date(b.dateOfPurchase).getTime() - new Date(a.dateOfPurchase).getTime()
        );
    
        return studentCourses;
    }
}