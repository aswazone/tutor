import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axiosInstance from "@/config/axios.config";
import { toast } from "sonner";
import { fetchTutorCourses } from "@/store/fetch";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Loader, SquarePen } from "lucide-react";
import { QuizModal } from "@/components/profile/QuizModal";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "@/components/ui/pagination";
import {motion} from 'framer-motion'
import { ICourse } from "@/types/course.type";
import { Question, Quiz } from "@/types/quiz.type";



export const QuizManageTab = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [currentQuizId,setCurrentQuizId] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [checkQuiz, setCheckQuiz] = useState<Quiz | null>(null);
  const {user} = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();
  const [searchParams,setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 3;
  

  const fetchCourses = useCallback(async () => {
      setIsLoading(true);
      const result = dispatch(fetchTutorCourses({id:'',page:1,limit:Infinity})).unwrap();
          result.then(({data}) => {
              setCourses(data)
              setIsLoading(false);
          }).catch((error) => {
              setIsLoading(false);
              console.error(error);
          })
  }, [dispatch]);


  useEffect(() => {
    fetchCourses();
  }, [dispatch,fetchCourses]);

  const fetchQuizzes = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/v1/quizzes/tutor",{
        params: {page:page,limit:pageSize}
      });
      const {data,total} = response.data;
      console.log(response.data,'quizzes');
      setTotalPages(Math.ceil(total/pageSize));
      setTotalItems(total);
      setQuizzes(data);
      console.log(data,'tutor quizzes');
    } catch (err) {
      console.error(err);
    }
  }, [page]);

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
  }, [fetchCourses,fetchQuizzes]);

  const initQuizForm = () => {
    const baseQuestions = Array(5)
      .fill(null)
      .map(() => ({
        questionText: "",
        options: Array(4)
          .fill(null)
          .map(() => ({ text: "", isCorrect: false }))
      }));
    setQuiz(baseQuestions);
  };

  const handleCourseSelect = (courseId: string) => {
    const course = courses.find(c => c._id === courseId) || null;
    setSelectedCourse(course);
    initQuizForm();
    setShowDialog(true);
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...quiz];
    updated[index].questionText = text;
    setQuiz(updated);
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...quiz];
    updated[qIndex].options[oIndex].text = text;
    setQuiz(updated);
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    const updated = [...quiz];
    updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === oIndex
    }));
    setQuiz(updated);
  };

  const addQuestion = () => {
    if (quiz.length < 10) {
      setQuiz([
        ...quiz,
        {
          questionText: "",
          options: Array(4)
            .fill(null)
            .map(() => ({ text: "", isCorrect: false }))
        }
      ]);
    }
  };

  const removeQuestion = (index: number) => {
    if (quiz.length > 5) {
      setQuiz(quiz.filter((_, i) => i !== index));
    }
  };

  const handleSaveQuiz = async () => {

    console.log(quiz,'quiz');


    if (!selectedCourse) return;
    if (quiz.length < 5) {
      toast.error("At least 5 questions required");
      return;
    }
    for (const q of quiz) {
      if (!q.questionText.trim()) {
        toast.error("All questions must have text");
        return;
      }
      if (!q.options.some(o => o.isCorrect)) {
        toast.error("Each question must have a correct answer");
        return;
      }
      if (q.options.some(o => !o.text.trim())) {
        toast.error("All options must have text");
        return;
      }
    }

    try {
      const response = await axiosInstance.post("/api/v1/quizzes/create", {
        courseId: selectedCourse._id,
        questions: quiz
      });
      console.log(response.data);
      toast.success("Quiz saved successfully");
      setShowDialog(false);
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save quiz");
    }
  };

  const confirmDelete = (quizId: string) =>{
    toast('Are you sure you want to delete this quiz?', {
      className: 'mt-10',
      duration: 3000,
      position: 'top-right',
      action: {
        label: 'Yes',
        onClick: () => handleDeleteQuiz(quizId)
      }
    });
  }

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await axiosInstance.delete(`/api/v1/quizzes/delete/${quizId}`);
      toast.success("Quiz deleted");
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete quiz");
    }
  };

  const handleEditQuiz = (quizId: string) => {
    const quizToEdit = quizzes.find(q => q._id === quizId) || null;
    if (!quizToEdit) return;
    setQuiz(quizToEdit.questions);
    setCurrentQuizId(quizId)
    console.log(quizToEdit, "quizToEdit");
    setSelectedCourse(courses.find(c => c._id === quizToEdit.courseId._id) || null);
    setIsEditMode(true);
    setShowDialog(true);
  };

  const handleUpdateQuiz = async () => {
    try {
      await axiosInstance.patch(`/api/v1/quizzes/edit/${currentQuizId}`, {
        questions: quiz
      });
      toast.success("Quiz updated");
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quiz");
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setIsEditMode(false);
    setCurrentQuizId('');
    setSelectedCourse(null);  
  }

  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  return (
    <div>
      {/* Add Quiz Button with Course Dropdown */}
      <div className="mb-6">
        <Select value={selectedCourse?._id ?? ""} onValueChange={handleCourseSelect}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select course to add quiz" />
          </SelectTrigger>
          <SelectContent>
            {courses
              .filter(c => !c.hasQuiz)
              .map(course => (
                <SelectItem key={course._id} value={course._id}>
                  {course.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quiz List */}
      <div>
        <h3 className="text-lg font-semibold mb-3">My Quizzes</h3>
        {isLoading ? (
          <div className="flex items-center gap-2"><span>Loading...</span><Loader className="h-4 w-4 animate-spin" /></div>
        ) : quizzes.length === 0 ? (
          <p className="text-gray-400">No quizzes created yet.</p>
        ) : (
          <ul className="space-y-3">
            {quizzes.length > 0 && quizzes.map((quiz, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
              <li key={quiz._id} className="border border-slate-700/40 border-r-0 border-t-0 border-b-[2px] rounded-md rounded-tl-none p-4 bg-slate-800/30">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{quiz.courseId.title}</h4>
                    <p className="text-sm text-gray-400">
                      {quiz.questions.length} questions • Created{" "}
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex">
                    <Button variant={'outline'} className="text-sky-600 hover:text-sky-500 cursor-pointer rounded-tl-none rounded-r-none border-r-0" size="sm" onClick={() => setCheckQuiz(quiz)}>Check</Button>
                    <Button variant={'outline'} className="text-sky-300 hover:text-sky-200 cursor-pointer rounded-none border-x-0" size="sm" onClick={() => handleEditQuiz(quiz._id)}><SquarePen className="h-4 w-4" /></Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="cursor-pointer rounded-l-none text-red-500 hover:text-red-400 border-l-0"
                      onClick={() => confirmDelete(quiz._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
              </motion.div>
            ))}
          </ul>
        )}
      </div>
      <Pagination 
        className="mt-4 justify-end"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showTotal
        totalItems={totalItems}
        itemsPerPage={pageSize}
      />

      {/* Quiz Creation Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit" : "Create"} Quiz for {selectedCourse?.title}</DialogTitle>
          </DialogHeader>

          {quiz.map((q, qIndex) => (
            <div key={qIndex} className="border rounded p-4 my-3 bg-slate-900/30">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Question {qIndex + 1}</span>
                {quiz.length > 5 && (
                  <Button variant="destructive" size="sm" onClick={() => removeQuestion(qIndex)}>
                    Remove
                  </Button>
                )}
              </div>
              <Input
                placeholder="Enter question text"
                value={q.questionText}
                onChange={e => updateQuestionText(qIndex, e.target.value)}
              />
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2 mt-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={opt.isCorrect}
                    onChange={() => setCorrectOption(qIndex, oIndex)}
                  />
                  <Input
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt.text}
                    onChange={e => updateOptionText(qIndex, oIndex, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}

          {quiz.length < 10 && (
            <Button variant="secondary" onClick={addQuestion}>
              Add Another Question
            </Button>
          )}

          <div className="flex justify-end mt-4 gap-3">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            {isEditMode ? <Button onClick={handleUpdateQuiz}>Edit Quiz</Button> : <Button onClick={handleSaveQuiz}>Save Quiz</Button>}
          </div>
        </DialogContent>
      </Dialog>
      {checkQuiz && (
        <QuizModal
          onSubmit={() => toast.success("Quiz Ok !")}
          courseId={checkQuiz.courseId._id}
          userId={user?._id}
          isTest={true}
          open={!!checkQuiz}
          onClose={() => setCheckQuiz(null)}
          quizTitle={checkQuiz.courseId.title}
          questions={checkQuiz.questions}
        />
      )}
    </div>
  );
}
