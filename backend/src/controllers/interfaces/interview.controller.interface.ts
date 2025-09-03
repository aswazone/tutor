import { Request, Response, NextFunction } from "express";

export interface IInterviewController {
    generateQuestions: (req: Request, res: Response, next: NextFunction ) => Promise<void>;
    generateFeedback: (req: Request, res: Response, next: NextFunction ) => Promise<void>;
    createInterview: (req: Request, res: Response, next: NextFunction ) => Promise<void>;
    createInterviewFeedback: (req: Request, res: Response, next: NextFunction ) => Promise<void>;
    getInterview: (req: Request, res: Response, next: NextFunction ) => Promise<void>;
    getTutorCreatedInterviews: (req: Request, res: Response, next: NextFunction ) => Promise<void>;
    deleteInterview: (req: Request, res: Response, next: NextFunction ) => Promise<void>;
}