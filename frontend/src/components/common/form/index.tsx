import { Button } from '@/components/ui/button'
import {FC} from 'react'
import FormControls from './form-controls';
import { IFormControl } from '@/config';
import { SignInFormData, SignUpFormData } from '@/types';
interface CommonFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonText?: string;
  isBtnDisabled: boolean
  formControls?: IFormControl[];
  formData: SignInFormData | SignUpFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignInFormData>> | React.Dispatch<React.SetStateAction<SignUpFormData>>
}

const CommonForm:FC<CommonFormProps> = ({handleSubmit, buttonText = "Submit" ,formControls = [] , formData, setFormData, isBtnDisabled}) => {
  return (
    <form onSubmit={handleSubmit}>
        <FormControls formControls={formControls} formData={formData} setFormData={setFormData}/>
        <Button disabled={isBtnDisabled} type='submit' className='bg-radial-[at_0%_0%] from-black via-sky-900  to-blue-950 to-90% text-sky-300 mt-5 w-full hover:shadow-black/20 transform hover:scale-101'>{buttonText}</Button>
    </form>
  )
}

export default CommonForm;