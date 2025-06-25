import { AuthenticatedRequest } from "@/types/auth.type";
import { NextFunction ,Response} from "express";

export interface ICourseProgressController {
    getCurrentCourseProgress: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>
}