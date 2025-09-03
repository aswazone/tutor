import { InterviewController } from "@/controllers/implements/interview.controller";
import { CourseRepository } from "@/repositories/implements/course.repository";
import { FeedbackRepository } from "@/repositories/implements/feedback.repository";
import { InterviewRepository } from "@/repositories/implements/interview.repository";
import { UserRepository } from "@/repositories/implements/user.repository";
import { InterviewService } from "@/services/implements/interview.service";

export const interviewController = new InterviewController(new InterviewService(
    new InterviewRepository(), 
    new FeedbackRepository(),
    new UserRepository(),
    new CourseRepository()
));
