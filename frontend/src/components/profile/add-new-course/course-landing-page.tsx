import FormControls from "@/components/common/form/form-controls"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  courseLandingPageFormControls, 
  courseLandingInitialFormData,
  type IFormControl 
} from "@/config"
import { courseLandingSchema } from "@/schemas/course/course-landing.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import type { CourseLandingFormData } from "@/schemas/course/course-landing.schema"
import { useEffect, useRef } from "react"
import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Convert ICourseLandingPageFormControls to IFormControl
const formControls: IFormControl[] = courseLandingPageFormControls.map(control => ({
  ...control,
  type: control.type || 'text', // Provide default type if undefined
}))

const CourseLandingPage = ({
  onSubmit,
  initialData
}: {
  setCourseLandingData: (data: CourseLandingFormData) => void
  onSubmit: (data: CourseLandingFormData) => void,
  initialData?: CourseLandingFormData
}) => {
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const methods = useForm<CourseLandingFormData>({
    resolver: zodResolver(courseLandingSchema),
    defaultValues: initialData || courseLandingInitialFormData,
  })

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ color: [] }],
            [{ font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            ['link', 'clean']
          ]
        },
        placeholder: 'Write your course description...'
      });

      // Set initial value if any
      if (methods.getValues('description')) {
        quillRef.current.root.innerHTML = methods.getValues('description');
      }

      // Update form value when editor changes
      quillRef.current.on('text-change', () => {
        methods.setValue('description', quillRef.current!.root.innerHTML, {
          shouldValidate: true,
          shouldDirty: true
        });
      });
    }
  }, [methods]);

  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Landing Page</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <FormControls formControls={formControls}/>
            
            <FormField
              control={methods.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>                    
                      <div className="h-[250px] w-[308px] md:w-[711px] md:min-h-[150px] pb-25 md:pb-16">
                        <div ref={editorRef} className="bg-white/5 rounded-b-md border h-full" />
                        <input type="hidden" {...field} />
                      </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => { 
                methods.reset(courseLandingInitialFormData);
                if (quillRef.current) {
                  quillRef.current.setText('');
                }
              }}>
                Reset
              </Button>
              <Button type="submit">Save & Continue</Button>
            </div> 
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

export default CourseLandingPage