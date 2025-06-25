import { ICourseModel } from "@/models/interface/course.model.interface";
import { ICourseProgressModel } from "@/models/interface/courseProgress.model.interface";

export interface IChapterProgress {
    chapterId: string;
    isCompleted: boolean;
    lastWatched?: Date;
    watchTime?: number;
}

export interface IModuleProgress {
    moduleId: string;
    moduleName: string;
    chaptersProgress: IChapterProgress[];
    completedChapters: number;
    totalChapters: number;
}

export interface ICourseProgress {
    courseId: string;
    courseName: string;
    moduleProgress: IModuleProgress[];
    totalModules: number;
    completedModules: number;
    overallProgress: number;
    lastAccessed?: Date;
}


export interface ICourseProgressResponse {
    courseDetails: ICourseModel;
    progress: ICourseProgressModel;
    isPurchased: boolean;
    overallProgress: number;
    moduleCompletionStatus: Array<{
        moduleId: string;
        completed: boolean;
    }>;
    lastAccessed: Date;
}
export interface IIntialCourseProgressResponse {
    courseDetails: ICourseModel;
    progress: Partial<ICourseProgressModel>;
    isPurchased: boolean;
    overallProgress: number;
    moduleCompletionStatus: Array<{
        moduleId: string;
        completed: boolean;
    }>;
    lastAccessed: Date;
}

