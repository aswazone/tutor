import { Model } from "mongoose";
import { IQuizModel } from "../interface/quiz.model.interface";
import { Quiz } from "@/schema/quiz.schema";

export const QuizModel: Model<IQuizModel> = Quiz;