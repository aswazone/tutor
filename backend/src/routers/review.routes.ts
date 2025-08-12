import { reviewController } from "@/dependencies/review.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { Router } from "express";

const reviewRouter = Router();

reviewRouter.get('/tutor', authenticateToken, reviewController.getTutorReviews);
reviewRouter.get('/course', authenticateToken, reviewController.getCourseReviews);
reviewRouter.post('/create', authenticateToken, reviewController.createReview);
reviewRouter.delete('/delete/:reviewId', authenticateToken, reviewController.deleteReview);

export default reviewRouter;