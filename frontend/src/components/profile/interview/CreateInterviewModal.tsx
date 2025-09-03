
import React, { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';
import { InterviewFormData, InterviewFormSchema } from '@/schemas/interview';
import { toast } from 'sonner';
import FormContainer from './FormContainer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import QuestionList from './QuestionList';
import { RefreshCw, Trash2 } from 'lucide-react';
import InterviewLink from './InterviewLink';

interface CreateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const titleWithData = [
  {
    title:'Create New Interview',
    description:'Please fill out the details of your interview.'
  },
  {
    title:'Generate Questions',
    description:'The interview questions will be generated here.'
  },
  {
    title:'Review and Submit',
    description:'Review the interview details and submit the interview.'
  }
]

const CreateInterviewDialog: React.FC<CreateInterviewDialogProps> = ({ 
  open, 
  onOpenChange,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<InterviewFormData | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [step, setStep] = useState(1);


  const form = useForm<InterviewFormData>({
    resolver: zodResolver(InterviewFormSchema),
    defaultValues: {
      domain: '',
      description: '',
      duration: '15minutes',
      interviewTypes: ['technical'],
    },
  });


  const handleGenerateQuestions = async (data: InterviewFormData) => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Generating questions with data:', data);
      setFormData(data);
      setStep(2);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = useCallback(() => {
    setStep(1);
    form.reset();
  }, [form]);


  const handleCancel = useCallback(async () => {
    const formValues = form.getValues();
    const isFormEmpty = 
      formValues.domain === '' &&
      formValues.description === '' &&
      formValues.duration === '15minutes' &&
      (
        formValues.interviewTypes.length === 0 || 
        (formValues.interviewTypes.length === 1 && formValues.interviewTypes[0] === 'technical')
      );

    console.log(isFormEmpty, 'isFormEmpty');
    
    if (!isFormEmpty) {
      toast(`${step === 1 ? 'Are you sure you want to cancel?, you should reset the form !' 
              : step === 2 ? 'Are you sure you want to cancel?, you should drop it !'
              : 'Are you sure you want to drop it? The interview is at next door.  '}`, {
        position: 'top-right'
      });
      return;
    }
    handleReset();
    onOpenChange(false);
  }, [form, onOpenChange, handleReset, step]);


  const onCreatingLink = (interviewId:string) => {
    setInterviewId(interviewId);
    setStep(3);
  }

  const toHome = () => {
    handleReset();
    onOpenChange(!open);
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className={`flex-col sm:max-w-md p-0 ${step ===2 && 'border-b-4 border-b-sky-500/80'}`}>
        <div className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <DialogHeader className="bg-sky-950/10 gap-1">
              <DialogTitle className="text-sky-400/80">{titleWithData[step-1].title}</DialogTitle>
              <DialogDescription className="text-xs text-sky-200/40">{titleWithData[step-1].description}</DialogDescription>
            </DialogHeader>
          </div>
          <Progress value={step * 33.33} className='h-1'/>
        </div>

        {step === 1 ? 
          <FormContainer 
              form={form} 
              isGenerating={isGenerating}
              handleGenerateQuestions={handleGenerateQuestions}
          />
          :step === 2 ?
            <QuestionList formData={formData!} onCreatingLink={onCreatingLink}/>
            :
            <InterviewLink createNew={handleReset} toHome={toHome} interviewId={interviewId!} formData={formData!}/>
        }

        {step === 2 && <div 
          onClick={()=>handleGenerateQuestions(form.getValues())} 
          className="absolute -bottom-10 left-0 flex px-1 text-sky-400/80 justify-center items-center rounded-full border border-white/10 cursor-pointer"
        >
          <span className="text-xs pl-1">Regenerate</span>
          <RefreshCw className={`w-6 h-6 p-1 ${isGenerating && 'animate-spin'}`} />
        </div>}
        {step !== 3 && <div 
          onClick={handleReset}
          className="absolute top-4 right-12 flex px-1 text-amber-400/80 justify-center items-center rounded-full border border-white/10 cursor-pointer"
        >
          <span className="text-xs pl-1">{step === 1 ? 'Reset' : 'Drop'}</span>
          {step !== 1 ? <Trash2 className="w-6 h-6 p-1" /> : <RefreshCw className="w-6 h-6 p-1" />}
        </div>}
      </DialogContent>
    </Dialog>
  );
};

export default CreateInterviewDialog;
