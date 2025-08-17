import { AuthenticatedRequest } from "@/types/auth.type";
import { Response, NextFunction } from "express";

export interface IQuizController {
    getQuizzes: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getQuiz: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    createQuiz: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    updateQuiz: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteQuiz: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}