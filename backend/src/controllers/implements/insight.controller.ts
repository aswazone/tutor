import { IInsightService } from "@/services/interface/insight.service.interface";
import { AuthenticatedRequest } from "@/types/auth.type";
import { NextFunction , Response} from "express";

export class InsightController {
    constructor(
        private readonly _insightService: IInsightService
    ) {}

    getAllCoursesInsights = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {tutorId,courseId} = req.params;
            const insights = await this._insightService.getAllCoursesInsights(tutorId,courseId);
            res.json(insights);
        } catch (error) {
            next(error);
        }
    }
}