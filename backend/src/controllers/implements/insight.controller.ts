import { IInsightService } from "@/services/interface/insight.service.interface";
import { AuthenticatedRequest } from "@/types/auth.type";
import { NextFunction , Response} from "express";

export class InsightController {
    constructor(
        private readonly _insightService: IInsightService
    ) {}

    getSingleCourseInsights = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {tutorId,courseId} = req.params;
            const insights = await this._insightService.getSingleCourseInsights(tutorId,courseId);
            res.json(insights);
        } catch (error) {
            next(error);
        }
    }
    getTutorDashboardInsights = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {tutorId} = req.params;
            console.log(tutorId);
            const insights = await this._insightService.getTutorDashboardInsights(tutorId);
            res.json(insights);
        } catch (error) {
            next(error);
        }
    }
    getStudentDashboardInsights = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {studentId} = req.params;
            console.log(studentId);
            const insights = await this._insightService.getStudentDashboardInsights(studentId);
            res.json(insights);
        } catch (error) {
            next(error);
        }
    }
}