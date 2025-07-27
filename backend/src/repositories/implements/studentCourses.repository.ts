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
        
        const studentCourses = await this.model.aggregate(
            [
                {
                    $match:{studentId: userId}
                },
                { $unwind: '$courses' },
                {
                    $addFields: {
                    courseObjId: { $toObjectId: '$courses.courseId' }
                    }
                },
                {
                    $lookup: {
                    from: 'courses',
                    localField: 'courseObjId',
                    foreignField: '_id',
                    as: 'courseDetail'
                    }
                },
                { $unwind: '$courseDetail' },
                {
                    $match: {
                    'courseDetail.isPublished': true,
                    'courseDetail.isDeleted': false,
                    'courseDetail.isActive': true,
                    'courseDetail.isVerified': 'verified'
                    }
                },
                {
                    $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$courses', '$courseDetail']
                    }
                    }
                },
                {$sort: {
                    dateOfPurchase: -1
                }}
                ,
                {
                    $group: {
                    _id: '$studentId',
                    courses: {
                        $push: '$$ROOT'
                    }
                    }
                }
            ]
        ) as IStudentCoursesModel[];
        
        if (!studentCourses) return null;
    
        return studentCourses[0];
    }
}