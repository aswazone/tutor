export interface Question {
  question: string;
  type: string;
}

export interface QuestionResponse {
  interviewQuestions: Question[];
}

export interface InterviewData {
    questions: Question[];
    domain: string;
    description: string;
    duration: string;
    interviewTypes: string[];
    userEmail: string
}

export interface InterviewDataResponse extends InterviewData {
   id: string;
   createdAt: string;
}

export interface InterviewDataState extends InterviewData {
    candidateName: string,
}

export enum CallStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED"
}

export interface SavedMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface VapiMessage {
  type: 'transcript';
  role: 'user' | 'assistant';
  transcriptType: 'partial' | 'final';
  transcript: string;
}




interface InterviewRating {
  technicalSkills: number; 
  communication: number;     
  problemSolving: number;  
  experience: number;      
}

export interface InterviewFeedback {
  rating: InterviewRating;
  summary: string;
  recommendation: "Yes" | "No" | "Maybe";
  recommendationMsg: string;
}

export interface InterviewResponse {
  feedback: InterviewFeedback;
}

export interface InterviewFeedbackData {
    userName: string;
    userEmail: string;
    interviewId: string;
    feedback: InterviewFeedback;
    recommendation: boolean
}
