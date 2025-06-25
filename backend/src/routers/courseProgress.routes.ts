import { courseProgressController } from "@/dependencies/progress.di";
import { Router } from "express";


const courseProgressRouter = Router();

courseProgressRouter.get("/:userId/:courseId", courseProgressController.getCurrentCourseProgress);
courseProgressRouter.post("/mark-as-viewed", courseProgressController.markCurrentChapterAsViewed);
courseProgressRouter.post("/reset-progress", courseProgressController.resetCurrentCourseProgress);

export default courseProgressRouter