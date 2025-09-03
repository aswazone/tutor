import { IInterviewModel } from "@/models/interface/interview.model.interface";

export interface interviewFormData {
  domain: string;
  description: string;
  duration: string;
  interviewTypes: string[];  
}



interface InterviewRating {
  technicalSkills: number; 
  communication: number;     
  problemSolving: number;  
  experience: number;      
}

export interface InterviewFeedbackResponse {
  rating: InterviewRating;
  summary: string;
  recommendation: "Yes" | "No" | "Maybe";
  recommendationMsg: string;
}

export interface Question {
  question: string;
  type: string;
}

export interface QuestionResponse {
  interviewQuestions: Question[];
}

export interface FindInterviewResult {
    data: IInterviewModel[];
    total: number;
}