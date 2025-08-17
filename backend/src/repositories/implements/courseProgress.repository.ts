import { ICourseProgressModel } from "@/models/interface/courseProgress.model.interface";
import { BaseRepository } from "../base.repository";
import { ICourseProgressRepository } from "../interface/courseProgress.repository.interface";
import { CourseProgressModel } from "@/models/implements/courseProgress.model";

export class CourseProgressRepository extends BaseRepository<ICourseProgressModel> implements ICourseProgressRepository {
    constructor() {
        super(CourseProgressModel);
    }

    async getCurrentUserCourseProgress(userId: string, courseId: string): Promise<ICourseProgressModel | null> {
        return this.model.findOne({ studentId: userId, courseId }).populate('courseId').exec();
    }

    async createProgress(data: Partial<ICourseProgressModel>): Promise<ICourseProgressModel> {
        return this.model.create(data);
    }

    async resetProgress(courseProgressId: string): Promise<void> {
        await this.model.findByIdAndDelete(courseProgressId);
    }

    async getAllCourseProgress(): Promise<ICourseProgressModel[]> {
        return this.model.find().populate('courseId').exec();
    }

    async updateStageAndProgress(userId: string, courseId: string, data:Partial<ICourseProgressModel>): Promise<ICourseProgressModel | null> {
        const update = { ...data, quizCompleted: data?.quizScore && data?.quizScore >= 50 ? true : false };
        console.log(update,'repo-stage')
        return await this.model.findOneAndUpdate({ studentId: userId, courseId }, update, { new: true }).populate('courseId').exec();
    }
}