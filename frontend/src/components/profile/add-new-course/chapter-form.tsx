import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useRef, useState } from "react"
import Quill from "quill"
import 'quill/dist/quill.snow.css'
import { env } from "@/config/env.config"

const MAX_FILE_SIZE_VIDEO = 2 * 1024 * 1024 * 1024 // 2GB

interface ChapterFormValues {
  title: string;
  content: string;
  video: File | string | null;
  pdf: File | null;
  subtitle: File | null;
}

interface ChapterFormProps {
  onSubmit: (values: ChapterFormValues) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    content: string;
    video?: string | File;
    pdfUrl?: File;
    subtitleUrl?: File;
  }
}

export function ChapterForm({ onSubmit, onCancel, initialData }: ChapterFormProps) {
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const form = useForm<ChapterFormValues>({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      video: initialData?.video || null,
      pdf: null,
      subtitle: null
    }
  });

  // Custom validation functions
  const validateTitle = (title: string): true | string => {
    if (!title) {
      return "Title is required";
    }
    if (title.length < 5) {
      return "Title must be at least 5 characters";
    }
    return true;
  };

  const validateContent = (content: string): true | string => {
    if (!content) {
      return "Content is required";
    }
    if (content.length < 50) {
      return "Content must be at least 50 characters";
    }
    if (content.length > 3000) {
      return "Content must be less than 3000 characters";
    }
    return true;
  };

  // Custom validation function for video
  const validateVideo = (video: File | string | null): true | string => {
    if (!video) {
      return "Video is required";
    }

    if (video instanceof File) {
      if (video.size > MAX_FILE_SIZE_VIDEO) {
        return "Video size should be less than 2GB";
      }
      if (!video.type.startsWith("video/")) {
        return "File must be a video";
      }
    }

    return true;
  };

  const handleSubmit = (data: ChapterFormValues) => {
    // Validate title
    const titleValidation = validateTitle(data.title);
    if (titleValidation !== true) {
      form.setError('title', {
        type: 'custom',
        message: titleValidation
      });
      return;
    }

    // Validate content
    const contentValidation = validateContent(data.content);
    if (contentValidation !== true) {
      form.setError('content', {
        type: 'custom',
        message: contentValidation
      });
      return;
    }

    // Validate video
    const videoValidation = validateVideo(data.video);
    if (videoValidation !== true) {
      form.setError('video', {
        type: 'custom',
        message: videoValidation
      });
      return;
    }

    onSubmit(data);
  };

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

  // Add cleanup effect for video preview URL
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 w-full px-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sky-400/60">Chapter Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter chapter title" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    const validation = validateTitle(e.target.value);
                    if (validation !== true) {
                      form.setError('title', {
                        type: 'custom',
                        message: validation
                      });
                    } else {
                      form.clearErrors('title');
                    }
                  }}
                />
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
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="video/*"
                    className="border-sky-800 w-[258px]"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const videoUrl = URL.createObjectURL(file);
                        setVideoPreviewUrl(videoUrl);
                        onChange(file);
                      }
                    }}
                  />
                  {/* Video Preview */}
                  {(videoPreviewUrl || form.watch('video')) && (
                    <div className="mt-2 relative w-full md:w-[334px] aspect-video rounded-lg overflow-hidden bg-black/20">
                      <video 
                        src={
                          videoPreviewUrl || 
                          (typeof form.watch('video') === 'string' 
                            ? `${env.AMZ_BUCKET_NAME}/${form.watch('video')}` 
                            : form.watch('video') instanceof File 
                              ? URL.createObjectURL(form.watch('video') as File) 
                              : undefined)
                        }
                        className="w-full h-full"
                        controls
                        autoPlay={false}
                        muted
                      />
                    </div>
                  )}
                  {/* File name display */}
                  {form.watch('video') && (
                    <p className="text-xs text-sky-300/30 truncate mt-1">
                      {form.watch('video') instanceof File 
                        ? `New: ${(form.watch('video') as File).name}`
                        : `Current: ${form.watch('video')}`
                      }
                    </p>
                  )}
                </div>
              </FormControl>
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
