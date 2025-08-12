import { Request, Response, NextFunction } from "express";

export interface IReviewController {
    getTutorReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCourseReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}