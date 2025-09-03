import Loader from "@/components/ui/loader";
import { InterviewFormData } from "@/schemas/interview"
import { interviewService } from "@/services/interview.service"
import { QuestionResponse } from "@/types/interview.type";
import { useEffect, useState } from "react"
import QuestionListContainer from "./QuestionListContainer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const QuestionList = ({onCreatingLink,formData}:{ onCreatingLink:(link:string)=>void, formData:InterviewFormData }) => {
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [questionList, setQuestionList] = useState<QuestionResponse | null>({
    "interviewQuestions": [
      {
        "question": "Could you briefly walk me through a recent full-stack project you worked on, highlighting your specific contributions to the Node.js backend, React frontend, and MongoDB database interactions?",
        "type": "Experience/Technical"
      },
      {
        "question": "In React, how do you manage state and side effects in functional components? Can you explain the purpose and common use cases for `useState` and `useEffect` hooks?",     
        "type": "Technical"
      },
      {
        "question": "When building a RESTful API with Node.js and Express, how do you ensure proper error handling and logging across your routes and middleware? Describe your approach.",    
        "type": "Technical"
      },
      {
        "question": "Considering MongoDB is a NoSQL database, what are your key considerations when designing a document schema, especially regarding data relationships and query performance for a typical application?",
        "type": "Technical"
      },
      {
        "question": "For a full-stack application, what are some critical security practices you would implement to protect both the frontend (React) and the backend (Node.js/Express) API, particularly concerning user authentication and authorization?", 
        "type": "Technical/Problem Solving"
      }
    ]
  });

  useEffect(() => {
    const generateQuestionsFromPrompt = async () => {
      if (!formData) return;
      
      try {
        setIsLoading(true);
        const response = await interviewService.generateQuestions(formData);
        if (response) {
          setQuestionList(response);
        }
      } catch (error) {
        console.error('Error generating questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateQuestionsFromPrompt();
  }, [formData]);

  const handleFinish = async () => {
    if (!questionList || !formData) return;
    try {
      const response = await interviewService.createInterview({
        ...formData,
        questions: questionList?.interviewQuestions || [],
        userEmail: user?.userEmail as string
      });

      if (response) {
        console.log(response);
        onCreatingLink(response?.interviewId);
      }

      
    } catch (error) {
      console.log(error);
    }
  }

  console.log(questionList, 'question list');

  return (
    <div className="mt-0 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-sky-950/20 scrollbar-thumb-sky-300/20">
      {isLoading && (
        <div className="m-6 mt-0 p-6 bg-sky-500/30 rounded-b-lg border border-sky-300/40 flex items-center gap-2">
          <div>
            <h2 className="font-bold text-sky-100">Generating interview Questions</h2>
            <p className="text-xs text-sky-200/60">Our AI is crafting personalized questions based on your job position!</p>
          </div>
          <Loader className="w-10 h-10 text-sky-300"/>
        </div>
      )}
      
      {!isLoading && questionList?.interviewQuestions && (
        <QuestionListContainer questionList={questionList} />
      )}
      {
      !isLoading && <Button 
          disabled={!questionList?.interviewQuestions || !formData} 
          onClick={handleFinish} 
          className="absolute -bottom-12 right-0 rounded-xl rounded-tl-none bg-sky-500 px-6 py-2 text-sky-100 hover:bg-sky-500/80 cursor-pointer"
          >
            Create Interview Link & Finish
          </Button>}
    </div>
  )
}

export default QuestionList;