import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Sparkles, Code2, Users, Briefcase, Lightbulb, Crown, Loader2 } from 'lucide-react';
import FormControls from '@/components/common/form/form-controls';
import { IFormControl, interviewModalFormControls } from '@/config/helper.config';
import { InterviewFormData } from '@/schemas/interview';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

// Prepare controls and type list
const formControls: IFormControl[] = interviewModalFormControls.map(control => ({
  ...control,
  type: control.type || 'text',
}));

const interviewTypes = [
  { id: 'technical', label: 'Technical', icon: <Code2 className="w-4 h-4" />, variant: 'default' as const },
  { id: 'behavioral', label: 'Behavioral', icon: <Users className="w-4 h-4" />, variant: 'secondary' as const },
  { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" />, variant: 'secondary' as const },
  { id: 'problem-solving', label: 'Problem Solving', icon: <Lightbulb className="w-4 h-4" />, variant: 'secondary' as const },
  { id: 'leadership', label: 'Leadership', icon: <Crown className="w-4 h-4" />, variant: 'secondary' as const },
];

interface FormContainerProps {
  form: UseFormReturn<InterviewFormData>;
  isGenerating: boolean;
  handleGenerateQuestions: (data: InterviewFormData) => Promise<void>;
}

const FormContainer: React.FC<FormContainerProps> = ({
  form,
  isGenerating,
  handleGenerateQuestions,
}) => {
  const selectedTypes = form.watch('interviewTypes');

  const toggleInterviewType = (typeId: string) => {
    const currentTypes = selectedTypes || [];
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(id => id !== typeId)
      : [...currentTypes, typeId];
    form.setValue('interviewTypes', newTypes);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleGenerateQuestions)} className="px-6">
        <FormControls formControls={formControls} />

        <FormField
          control={form.control}
          name="interviewTypes"
          render={() => (
            <FormItem className="my-6">
              <FormLabel className="text-sm font-medium mb-3 block">
                Interview Types
              </FormLabel>
              <div className="flex flex-wrap gap-2">
                {interviewTypes.map(type => {
                  const isSelected = selectedTypes?.includes(type.id);
                  return (
                    <Badge
                      key={type.id}
                      variant={isSelected ? "default" : "secondary"}
                      className={`cursor-pointer flex items-center gap-2 px-3 py-1 text-sm font-medium
                        ${isSelected 
                          ? 'bg-sky-700 text-white hover:bg-sky-500'
                          : 'bg-background text-sky-500/60 hover:text-sky-400 hover:bg-background/50 border border-sky-600/20'
                        }`}
                      onClick={() => toggleInterviewType(type.id)}
                    >
                      {type.icon}
                      {type.label}
                    </Badge>
                  );
                })}
              </div>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end py-4">
          <Button
            type="submit"
            variant="ghost"
            disabled={isGenerating}
            className="text-sky-400 hover:text-sky-300 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <div className="flex items-center">
                <Sparkles 
                  stroke="#3498db"
                  fill="#3498db"
                  className="animate-caret-blink transition-all duration-1000"
                />
                <span className="ml-1 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-sky-300 hover:bg-gradient-to-r hover:from-sky-300 hover:to-sky-400">
                  Generate
                </span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormContainer;
