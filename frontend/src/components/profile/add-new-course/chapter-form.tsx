import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useRef } from "react"
import Quill from "quill"
import 'quill/dist/quill.snow.css'

const MAX_FILE_SIZE_PDF = 50 * 1024 * 1024 // 50MB
const MAX_FILE_SIZE_VIDEO = 2 * 1024 * 1024 * 1024 // 2GB
const MAX_FILE_SIZE_SUBTITLE = 50 * 1024 * 1024 // 50MB

const chapterFormSchema = z.object({
  title: z.string().min(5, "Title is required, at least 5 characters"),
  content: z.string()
      .min(50, "Description must be at least 50 characters")
      .max(3000, "Description must be less than 3000 characters"),
  video: z.any()
    .refine((file) => {
      if (file === null || file === undefined) return false;
      return file instanceof File;
    }, "Must be a file")
    .refine((file) => {
      if (!file) return false;
      return file.size <= MAX_FILE_SIZE_VIDEO;
    }, "Max file size is 2GB")
    .refine((file) => {
      if (!file) return false;
      return file.type.startsWith("video/");
    }, "File must be a video"),
  pdf: z.any()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File;
    }, "Must be a file")
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE_PDF;
    }, "Max file size is 50MB")
    .optional(),
  subtitle: z.any()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File;
    }, "Must be a file")
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE_SUBTITLE;
    }, "Max file size is 50MB")
    .optional(),
})

type ChapterFormValues = z.infer<typeof chapterFormSchema>

interface ChapterFormProps {
  onSubmit: (values: ChapterFormValues) => void
  onCancel: () => void
  initialData?: {
    title: string;
    content: string;
    video?: File;
    pdfUrl?: File;
    subtitleUrl?: File;
  }
}

export function ChapterForm({ onSubmit, onCancel, initialData }: ChapterFormProps) {
  const form = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      video: null,
      pdf: null,
      subtitle: null
    }
  })
  
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Keep track of existing files
  const existingFiles = {
    video: initialData?.video,
    pdf: initialData?.pdfUrl,
    subtitle: initialData?.subtitleUrl
  };

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
        placeholder: 'Write your chapter content...'
      });

      // Set initial value if any
      if (initialData?.content) {
        quillRef.current.root.innerHTML = initialData.content;
      }

      // Update form value when editor changes
      quillRef.current.on('text-change', () => {
        const content = quillRef.current!.root.innerHTML;
        // Don't update if it's just empty HTML tags
        if (content === '<p><br></p>') {
          form.setValue('content', '', {
            shouldValidate: true,
            shouldDirty: true
          });
        } else {
          form.setValue('content', content, {
            shouldValidate: true,
            shouldDirty: true
          });
        }
      });
    }

    return () => {
      if (quillRef.current) {
        // Clean up toolbar when component unmounts
        const toolbar = document.querySelector('.ql-toolbar');
        toolbar?.remove();
        quillRef.current = null;
      }
    };
  }, [form, initialData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full px-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sky-400/60">Chapter Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter chapter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={() => (
            <FormItem>
              <FormLabel className="text-sky-400/60">Chapter Content</FormLabel>
              <FormControl>
                <div className="h-[200px] w-[258px] md:w-[334px] mb-23">
                  <div ref={editorRef} className="bg-white/5 rounded-b-md border h-full" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="video"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className="text-sky-400/60">Chapter Video</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="video/*"
                  className="border-sky-800 w-[258px]"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                />
              </FormControl>
              {form.watch('video') && (
                <p className="text-xs text-sky-300/30 truncate mt-1">
                  New: {form.watch('video')?.name}
                </p>
              )}
              {!form.watch('video') && existingFiles.video && (
                <p className="text-xs text-sky-300/30 truncate mt-1">
                  Current: {existingFiles.video.name}
                </p>
              )}
              {error && <FormMessage>{error.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pdf"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className="text-sky-400/60">Chapter PDF (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf"
                  className="border-sky-800"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                />
              </FormControl>
              {form.watch('pdf') && (
                <p className="text-xs text-sky-300/30 truncate mt-1">
                  New: {form.watch('pdf')?.name}
                </p>
              )}
              {!form.watch('pdf') && existingFiles.pdf && (
                <p className="text-xs text-sky-300/30 truncate mt-1">
                  Current: {existingFiles.pdf.name}
                </p>
              )}
              {error && <FormMessage>{error.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className="text-sky-400/60">Chapter Subtitle (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".srt,.vtt"
                  className="border-sky-800"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                />
              </FormControl>
              {form.watch('subtitle') && (
                <p className="text-xs text-sky-300/30 truncate mt-1">
                  New: {form.watch('subtitle')?.name}
                </p>
              )}
              {!form.watch('subtitle') && existingFiles.subtitle && (
                <p className="text-xs text-sky-300/30 truncate mt-1">
                  Current: {existingFiles.subtitle.name}
                </p>
              )}
              {error && <FormMessage>{error.message}</FormMessage>}
            </FormItem>
          )}
        />
        <div className="flex gap-4 justify-end">
          <Button 
            variant="outline"
            className="border rounded-tl-none rounded-br-none bg-red-700/5 text-red-400/60 hover:text-red-400/80 hover:bg-red-950/30" 
            type="button" 
            onClick={() => {
              onCancel();
              form.reset();
              if (quillRef.current) {
                quillRef.current.setText('');
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            className=" border rounded-tl-none rounded-br-none bg-sky-500/10 text-sky-400/60 hover:text-sky-400/80 hover:bg-sky-950/30" 
            type="submit"
          >
            Save Chapter
          </Button>
        </div>
      </form>
    </Form>
  )
}
