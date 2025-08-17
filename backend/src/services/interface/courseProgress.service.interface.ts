import { ICourseProgressModel } from "@/models/interface/courseProgress.model.interface";
import { ICourseProgressResponse, IIntialCourseProgressResponse } from "@/types/courseProgress.type";

export interface ICourseProgressService {
    getCurrentCourseProgress(userId: string, courseId: string): Promise<ICourseProgressResponse | {isPurchased: boolean, message: string} | IIntialCourseProgressResponse>;
    markCurrentChapterAsViewed(userId: string, courseId: string, chapterId: string, moduleId: string): Promise<ICourseProgressResponse>;
    resetCurrentCourseProgress(userId: string, courseId: string): Promise<IIntialCourseProgressResponse>;
    updateStageAndProgress(userId: string, courseId: string, data:Partial<ICourseProgressModel>): Promise<ICourseProgressModel | null>;
}