import { StudentCoursesModel } from "@/models/implements/studentCourses.model";
import { IStudentCoursesRepository } from "../interface/studentCourses.repository.interface";
import { BaseRepository } from "../base.repository";
import { IStudentCoursesModel } from "@/models/interface/studentCourses.model.interface";
import { FindCoursesByStudentResultAfterAggregation, IStudentCoursesAfterAggregation } from "@/types/course.type";
import { PipelineStage } from "mongoose";

export class StudentCoursesRepository extends BaseRepository<IStudentCoursesModel> implements IStudentCoursesRepository{
    constructor(){
        super(StudentCoursesModel);
    }

    async getAllStudentCourses(): Promise<IStudentCoursesModel[]> {
        return this.model.find();
    }

    async getStudentOwnedCourses(userId: string,page: number,limit: number,search: string): Promise<FindCoursesByStudentResultAfterAggregation> {
        const skip = (page - 1) * limit;

        const searchMatch = search
            ? { 'courseDetail.title': { $regex: search, $options: 'i' } }
            : {};


        const basePipeline: PipelineStage[] = [
            { $match: { studentId: userId } },
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
                    'courseDetail.isVerified': 'verified',
                    ...searchMatch
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                    $mergeObjects: ['$courses', '$courseDetail']
                    }
                }
            }
        ];


        const totalResult = await this.model.aggregate([
            ...basePipeline,
            { $count: 'total' }
        ]);
        const total = totalResult.length ? totalResult[0].total : 0;

        const data:IStudentCoursesAfterAggregation[] = await this.model.aggregate([
            ...basePipeline,
            { $sort: { dateOfPurchase: -1 as 1 | -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        return { data, total };
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