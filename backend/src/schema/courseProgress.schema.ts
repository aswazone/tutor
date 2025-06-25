
import { ICourseProgressModel } from "@/models/interface/courseProgress.model.interface";
import { model, Schema } from "mongoose";

const ChapterProgressSchema = new Schema({
    chapterId: { type: String, required: true },
    viewed: { type: Boolean, default: false },
    dateViewed: Date,
    watchTime: { type: Number, default: 0 },
    lastPosition: { type: Number, default: 0 }
}, { timestamps: true });

const ModuleProgressSchema = new Schema({
    moduleId: { type: String, required: true },
    viewed: { type: Boolean, default: false },
    dateViewed: Date,
    chapterProgress: [ChapterProgressSchema]
}, { timestamps: true });

const CourseProgressSchema = new Schema({
    studentId: { type: String, required: true },
    courseId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completionDate: Date,
    lastAccessed: { type: Date, default: Date.now },
    moduleProgress: [ModuleProgressSchema]
}, {
    timestamps: true,
    methods: {
        getProgressPercentage() {
            if (!this.moduleProgress.length) return 0;
            
            const totalChapters = this.moduleProgress.reduce((sum, module) => 
                sum + module.chapterProgress.length, 0);
            const completedChapters = this.moduleProgress.reduce((sum, module) => 
                sum + module.chapterProgress.filter(chapter => chapter.viewed).length, 0);
            
            return (completedChapters / totalChapters) * 100;
        },
        isModuleCompleted(moduleId: string) {
            const module = this.moduleProgress.find(m => m.moduleId === moduleId);
            return module?.chapterProgress.every(chapter => chapter.viewed) ?? false;
        }
    }
});

export const CourseProgress = model<ICourseProgressModel>('CourseProgress', CourseProgressSchema);