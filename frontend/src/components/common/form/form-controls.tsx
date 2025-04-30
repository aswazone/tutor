
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FC, ReactElement} from 'react';
import { IFormControl } from '@/config';
import { SignInFormData, SignUpFormData } from '@/types';
interface FormControlsProps {
  formControls: IFormControl[];
  formData: SignInFormData | SignUpFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>> | React.Dispatch<React.SetStateAction<SignInFormData>>
}

const FormControls: FC<FormControlsProps> = ({ formControls = [], formData, setFormData }) => {
  const renderComponentByType = (getControlItem: IFormControl): ReactElement => {

    const currentControlItemValue:string = formData[getControlItem.name as keyof (SignInFormData | SignUpFormData)] || '';


    switch (getControlItem.componentType) {
      case 'input':
        if(getControlItem.type === 'password') {
          return (
            <Input
              className="focus-visible:border-1 border-sky-600 focus-visible:ring-1 focus:bg-sky-700/10 focus:border-sky-400 text-cyan-400/50"
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              type={getControlItem.type}
              autoComplete="off"
              value={currentControlItemValue}
              onChange={(e) => setFormData({...formData,[getControlItem.name]: e.target.value})}
            />
          );
        }
        return (
          <Input
            className="focus-visible:border-1 border-sky-600 focus-visible:ring-1 focus:bg-sky-700/10 focus:border-sky-400 text-cyan-400/50"
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            onChange={(e) => setFormData({...formData,[getControlItem.name]: e.target.value})}
          />
        );
      case 'select':
        return (
          <Select
            value={currentControlItemValue}
            onValueChange={(value) => setFormData({...formData,[getControlItem.name]: value})}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map(optionItem => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={currentControlItemValue}
            onChange={(e) => setFormData({...formData,[getControlItem.name]: e.target.value})}
          />
        );
      default:
        return (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            onChange={(e) => setFormData({...formData,[getControlItem.name]: e.target.value})}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {formControls.map(controlItem => (
        <div key={controlItem.name}>
          <Label className='text-sky-900 mb-2 ' htmlFor={controlItem.name}>{controlItem.label}</Label>
          {renderComponentByType(controlItem)}
        </div>
      ))}
    </div>
  );
};

export default FormControls;
