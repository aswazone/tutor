import { QuestionResponse } from '@/types/interview.type';


const QuestionListContainer = ({questionList}:{questionList:QuestionResponse}) => {
  return (
    <div className="m-6 mt-0 space-y-4">
        {questionList.interviewQuestions.map((q, index) => (
        <div key={index} className="p-4 bg-sky-950/20 rounded-lg border border-sky-300/20">
            <div className="text-xs text-sky-300/60 mb-1">{q.type}</div>
            <div className="text-sm text-sky-100">{q.question}</div>
        </div>
        ))}
    </div>
  )
}

export default QuestionListContainer