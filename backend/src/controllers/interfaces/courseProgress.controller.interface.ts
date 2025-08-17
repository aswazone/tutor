import { AuthenticatedRequest } from "@/types/auth.type";
import { NextFunction ,Response} from "express";

export interface ICourseProgressController {
    getCurrentCourseProgress: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>
    markCurrentChapterAsViewed: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>
    resetCurrentCourseProgress: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>
    updateStageAndProgress: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>
}