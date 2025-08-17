import { ICourse } from "./course.type";

// Types
export type Option = { text: string; isCorrect: boolean };
export type Question = { questionText: string; options: Option[] };
// export type Course = { _id: string; title: string; hasQuiz: boolean };
export type Quiz = {
  _id: string;
  courseId: ICourse;
  questions: Question[];
  createdAt: string;
};