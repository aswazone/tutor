import { ReviewController } from "@/controllers/implements/review.controller";
import { ReviewRepository } from "@/repositories/implements/review.repository";
import { ReviewService } from "@/services/implements/review.service";

export const reviewController = new ReviewController(new ReviewService(new ReviewRepository()));