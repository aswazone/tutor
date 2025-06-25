import { Document } from "mongoose";

// export interface ICourseProgressModel extends Document {
//     studentId: string;
//     courseId: string;
//     completed: boolean;
//     completionDate: Date;
//     moduleProgress: {
//         moduleId: string;
//         viewed: boolean;
//         dateViewed: Date;
//         chapterProgress: {
//             chapterId: string;
//             viewed: boolean;
//             dateViewed: Date;
//         }[];
//     }[];
// }


export interface IChapterProgressModel {
    chapterId: string;
    viewed: boolean;
    dateViewed: Date;
    watchTime?: number;
    lastPosition?: number;
}

export interface IModuleProgressModel {
    moduleId: string;
    viewed: boolean;
    dateViewed: Date;
    chapterProgress: IChapterProgressModel[];
}

export interface ICourseProgressModel extends Document {
    studentId: string;
    courseId: string;
    completed: boolean;
    completionDate?: Date;
    lastAccessed: Date;
    moduleProgress: IModuleProgressModel[];
    getProgressPercentage(): number;
    isModuleCompleted(moduleId: string): boolean;
}