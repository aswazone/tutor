import { InterviewFeedbackResponse } from "@/types/interview.type";

export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {{jobTitle}}
Job Description:{{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}
📝 Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.
🧩 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
  question:"",
  type:'Technical/Behavioral/Experince/Problem Solving/Leadership'
},{
...
}]
🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`


export const FEEDBACK_PROMPT = `Based on this interview conversation between assistant and user: {{conversation}}
You are an interview evaluation AI. Respond ONLY with valid JSON, no other text or explanations.
Evaluate the candidate and provide ratings out of 10 for: technical Skills, Communication, Problem Solving, and Experience.

Respond with EXACTLY this JSON format:

{
  "feedback": {
    "rating": {
      "technicalSkills": 5,
      "communication": 6, 
      "problemSolving": 4,
      "experience": 7
    },
    "summary": "Candidate showed good communication skills during the interview. Technical knowledge was average with some gaps in problem-solving approaches. Overall performance was satisfactory but needs improvement in core areas.",
    "recommendation": "Maybe",
    "recommendationMsg": "Candidate has potential but requires additional technical training before being suitable for the role."
  }
}

IMPORTANT: Return ONLY the JSON object above, no markdown, no explanations, no other text.`;


export const FeedbackFallback:{feedback:InterviewFeedbackResponse} ={
    feedback: {
        rating: {
            technicalSkills: 1,
            communication: 1,
            problemSolving: 1,
            experience: 1
        },
        summary: "Unable to evaluate interview due to system error. Please retry the assessment process.",
        recommendation: "No" as const,
        recommendationMsg: "Evaluation failed - cannot provide hiring recommendation."
    }
};