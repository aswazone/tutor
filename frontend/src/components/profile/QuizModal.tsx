import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axiosInstance from "@/config/axios.config";

type Option = { text: string; isCorrect: boolean };
type Question = { questionText: string; options: Option[] };

interface QuizModalProps {
  isTest: boolean;
  onSubmit: () => void;
  userId?: string;
  courseId: string;
  open: boolean;
  onClose: () => void;
  quizTitle: string;
  questions: Question[];
}

export const QuizModal: React.FC<QuizModalProps> = ({ isTest = false, onSubmit, userId, courseId, open, onClose, quizTitle, questions }) => {
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  const resetQuiz = useCallback(() => {
    setAnswers(Array(questions.length).fill(null));
    setIsComplete(false);
    setScore(0);
  },[questions.length]);

  const handleToggleOption = (qIndex: number, oIndex: number) => {
    if (isComplete) return;
    setAnswers(prev => {
      const updated = [...prev];
      updated[qIndex] = updated[qIndex] === oIndex ? null : oIndex;
      return updated;
    });
  };

  const handleComplete = async () => {
    let correctCount = 0;
    answers.forEach((answerIdx, qIndex) => {
      if (
        answerIdx !== null && 
        questions[qIndex].options[answerIdx].isCorrect
      ) {
        correctCount++;
      }
    });
    const result = (correctCount / questions.length) * 100;
    setScore(result);
    setIsComplete(true);
    const stage = result >= 50 ? "certificate" : "quiz";

    if(!isTest && userId && courseId && result >= 50){
      console.log(stage,'stage',isTest)
      await axiosInstance.patch(`/api/v1/course-progress/stage-update/${userId}/${courseId}`, { quizScore: result, stage });
      onSubmit();
    }
  };

  const allAnswered = answers.every(a => a !== null);

  useEffect(() => {
    if (open) {
      resetQuiz();
    }
  }, [open, resetQuiz]);

  const handleClose = () => {
    resetQuiz();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[80vh] overflow-y-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>Check Quiz: {quizTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="border rounded-md rounded-tl-none p-4 bg-slate-900/40">
              <p className="font-semibold mb-3">{qIndex + 1}. {q.questionText}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex;
                  let bgColor = isSelected ? "bg-sky-600/60" : "bg-slate-800 hover:bg-slate-700";

                  if (isComplete) {
                    if (opt.isCorrect) {
                      bgColor = "bg-green-400/70";
                    } else if (isSelected && !opt.isCorrect) {
                      bgColor = "bg-red-600/70";
                    } else {
                      bgColor = "bg-slate-800";
                    }
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleToggleOption(qIndex, oIndex)}
                      className={cn(
                        "p-2 rounded-md rounded-tl-none border text-sm text-center transition-colors duration-200",
                        bgColor
                      )}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 gap-3">
          {!isComplete ? (
            <Button onClick={handleComplete} disabled={!allAnswered}>
              Complete Quiz
            </Button>
          ) : (
            <>
              <span className="text-white font-semibold self-center">
                Score: {score.toFixed(0)}%
              </span>
              {score < 50 && (
                <Button variant="secondary" onClick={resetQuiz}>
                  Retry
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
