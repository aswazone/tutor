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
}