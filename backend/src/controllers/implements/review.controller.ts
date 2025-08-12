import { IReviewService } from "@/services/interface/review.service.interface";
import { IReviewController } from "../interfaces/review.controller.interface";
import { Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { AuthenticatedRequest } from "@/types/auth.type";
import { HttpResponse } from "@/constants/response.constant";

export class ReviewController implements IReviewController {
    constructor(
        private readonly _reviewService:IReviewService
    ){}

    getTutorReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.query;

            if (!req.user?.id) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message:HttpResponse.UNAUTHORIZED});
                return;
            }

            const reviews = await this._reviewService.getTutorReviews(req.user?.id,Number(page),Number(limit));
            res.status(HttpStatus.OK).json(reviews);
        } catch (error) {
            next(error);
        }
    };

    getCourseReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit , relatedId } = req.query;

            if (!req.user?.id) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message:HttpResponse.UNAUTHORIZED});
                return;
            }
            
            const reviews = await this._reviewService.getCourseReviews(relatedId as string,Number(page),Number(limit));
            res.status(HttpStatus.OK).json(reviews);
        } catch (error) {
            next(error);
        }
    };

    createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { rating, review, relatedId, reviewType } = req.body;
            const result = this._reviewService.createReview({ rating, review, relatedId, reviewerId: req.user?.id, reviewType });
            res.status(HttpStatus.CREATED).json(result);
        } catch (error) {
            next(error);
        }
    };

    deleteReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { reviewId } = req.params;
            const review = await this._reviewService.deleteReview(reviewId);
            res.status(HttpStatus.OK).json(review);
        } catch (error) {
            next(error);
        }
    };

}