import { QuizController } from "@/controllers/implements/quiz.controller";
import { CourseRepository } from "@/repositories/implements/course.repository";
import { QuizRepository } from "@/repositories/implements/quiz.repository";
import { QuizService } from "@/services/implements/quiz.service";

export const quizController = new QuizController(new QuizService(new QuizRepository(), new CourseRepository()));