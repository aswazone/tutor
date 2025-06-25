import { type IFormControl } from "@/config/helper.config";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { CategorySelector } from "./category-selector";

const FormControls = ({ formControls }: { formControls: IFormControl[] }) => {
  const { control } = useFormContext();

  const renderFormControl = (formControl: IFormControl) => {
    const { name, label, type, componentType, options, placeholder } = formControl;

    return (
      <FormField
        key={name}
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>            
            <FormControl>
              {(() => {
                switch (componentType) {
                  case "input":
                    return <Input type={type} placeholder={placeholder} {...field} />;
                  case "textarea":
                    return <Textarea placeholder={placeholder} {...field} />;
                  case "select":
                    if (name === "category" && options) {
                      return (
                        <CategorySelector
                          categories={options}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      );
                    } else if (options) {
                      return (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder={placeholder || `Select ${label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }
                    return null;
                  default:
                    return null;
                }
              })()}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return <div className="space-y-6">{formControls.map(renderFormControl)}</div>;
};

export default FormControls;
