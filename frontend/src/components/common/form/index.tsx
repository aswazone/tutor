import { Button } from '@/components/ui/button'
import FormControls from './form-controls';
import { IFormControl } from '@/config';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { Form } from '@/components/ui/form';

interface CommonFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  buttonText?: string;
  formControls?: IFormControl[];
}

const CommonForm = <T extends FieldValues>({ form, onSubmit, buttonText = "Submit", formControls = [] }: CommonFormProps<T>) => {
  const { isLoading } = useSelector((state: RootState) => state.auth);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormControls form={form} formControls={formControls} />
        <Button 
          disabled={isLoading} 
          type='submit' 
          className='bg-gradient-to-br from-black via-sky-900 to-blue-950 text-sky-100 mt-5 w-full hover:shadow-black/20 transform hover:scale-101'
        >
          {isLoading ? <Loader2 className='animate-spin' /> : buttonText}
        </Button>
      </form>
    </Form>
  )
}

export default CommonForm;