import { ICourseProgressResponse, IIntialCourseProgressResponse } from "@/types/courseProgress.type";

export interface ICourseProgressService {
    getCurrentCourseProgress(userId: string, courseId: string): Promise<ICourseProgressResponse | {isPurchased: boolean, message: string} | IIntialCourseProgressResponse>;
    // markCurrentModuleAsViewed(userId: string, courseId: string, moduleId: string): Promise<any>;
    markCurrentChapterAsViewed(userId: string, courseId: string, chapterId: string, moduleId: string): Promise<ICourseProgressResponse>;
    resetCurrentCourseProgress(userId: string, courseId: string): Promise<IIntialCourseProgressResponse>;
}