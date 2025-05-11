import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IFormControl } from '@/config';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface FormControlsProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  formControls: IFormControl[];
}

const FormControls = <T extends FieldValues>({ formControls = [], form }: FormControlsProps<T>) => {
  return (
    <div className="flex flex-col gap-3">
      {formControls.map(controlItem => (
        <FormField
          key={controlItem.name}
          control={form.control}
          name={controlItem.name as Path<T>}
          render={({ field }) => (
            <FormItem>
              <Label className='text-sky-900 mb-2' htmlFor={controlItem.name}>{controlItem.label}</Label>
              <FormControl>
                {(() => {
                  switch (controlItem.componentType) {
                    case 'input':
                      return (
                        <Input
                          className="focus-visible:border-1 border-sky-600 focus-visible:ring-1 focus:bg-sky-700/10 focus:border-sky-400 text-cyan-400/50"
                          id={controlItem.name}
                          placeholder={controlItem.placeholder}
                          type={controlItem.type}
                          autoComplete={controlItem.type === 'password' ? 'off' : undefined}
                          {...field}
                        />
                      );
                    case 'select':
                      return (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={controlItem.label} />
                          </SelectTrigger>
                          <SelectContent>
                            {controlItem.options?.map(optionItem => (
                              <SelectItem key={optionItem.id} value={optionItem.id}>
                                {optionItem.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    case 'textarea':
                      return (
                        <Textarea
                          id={controlItem.name}
                          placeholder={controlItem.placeholder}
                          {...field}
                        />
                      );
                    default:
                      return (
                        <Input
                          id={controlItem.name}
                          placeholder={controlItem.placeholder}
                          type={controlItem.type}
                          {...field}
                        />
                      );
                  }
                })()}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

export default FormControls;
