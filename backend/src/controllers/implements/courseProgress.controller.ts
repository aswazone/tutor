import { AuthenticatedRequest } from "@/types/auth.type";
import { NextFunction, Response } from "express";
import { ICourseProgressController } from "../interfaces/courseProgress.controller.interface";
import { ICourseProgressService } from "@/services/interface/courseProgress.service.interface";

export class CourseProgressController implements ICourseProgressController {
    constructor(private readonly _courseProgressService: ICourseProgressService) {}

    getCurrentCourseProgress = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const {userId,courseId} = req.params;

            const courseProgress = await this._courseProgressService.getCurrentCourseProgress(userId,courseId);
            res.json(courseProgress);
        } catch (error) {
            next(error);
        }
    }

    markCurrentChapterAsViewed = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {userId,courseId,chapterId,moduleId} = req.body;
            const courseProgress = await this._courseProgressService.markCurrentChapterAsViewed(userId,courseId,chapterId,moduleId);
            res.json(courseProgress);
        } catch (error) {
            next(error);
        }
     }

    resetCurrentCourseProgress = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {userId,courseId} = req.body;
            const courseProgress = await this._courseProgressService.resetCurrentCourseProgress(userId,courseId);
            res.json(courseProgress);
        } catch (error) {
            next(error);
        }
     }
}