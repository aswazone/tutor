import { Document } from "mongoose";

export type ProgressStage = 'review'|'quiz'|'certificate'|'final';
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
    stage: ProgressStage;
    quizScore: number;
    quizCompleted: boolean;
    certificate: { _id: string; url: string };
    lastAccessed: Date;
    moduleProgress: IModuleProgressModel[];
    getProgressPercentage(): number;
    isModuleCompleted(moduleId: string): boolean;
}