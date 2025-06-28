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
import { Switch } from "@/components/ui/switch"
import { ChapterFormProps, ChapterFormValues } from "@/types/profile.type"
import Loader from "@/components/ui/loader"
import { toast } from "sonner"

const MAX_FILE_SIZE_VIDEO = 500 * 1024 * 1024 // 500MB

export function ChapterForm({ onSubmit, onCancel, initialData }: ChapterFormProps) {
  
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const form = useForm<ChapterFormValues>({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      video: initialData?.video || undefined,
      pdf: initialData?.pdfUrl || undefined,
      freePreview: initialData?.freePreview || false
    }
  });

  // Custom validation functions
  const validateTitle = (title: string): true | string => {
    if (!title.trim()) {
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
  const validateVideo = (video: File | string | undefined): true | string => {
    if (!video) {
      return "Video is required";
    }

    if (video instanceof File) {
      if (video.size > MAX_FILE_SIZE_VIDEO) {
        return "Video size should be less than 500MB";
      }
      if (!video.type.startsWith("video/")) {
        return "File must be a video";
      }
    }

    return true;
  };

  // Custom validation function for pdf
  const validatePdf = (pdf: File | string | null): true | string => {
    if (!pdf) {
      return "PDF is required";
    }
    if (pdf instanceof File) {
      if (pdf.size > 10 * 1024 * 1024) {
        return "PDF size should be less than 10MB";
      }
      if (!pdf.type.startsWith("application/pdf")) {
        return "File must be a PDF";
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

    // Validate pdf
    if (data.pdf) {
      const pdfValidation = validatePdf(data.pdf);
      if (pdfValidation !== true) {
        form.setError('pdf', {
          type: 'custom',
          message: pdfValidation
        });
        return;
      }
    }

    onSubmit(data);
  };

  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);


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

  const [showSlowMessageVideo, setShowSlowMessageVideo] = useState(false);
  const [showSlowMessagePdf, setShowSlowMessagePdf] = useState(false);

useEffect(() => {
  let timer: NodeJS.Timeout;
  if (videoLoading) {
    timer = setTimeout(() => setShowSlowMessageVideo(true), 10000); // 10s
  } else {
    setShowSlowMessageVideo(false);
  }
  if (pdfLoading) {
    timer = setTimeout(() => setShowSlowMessagePdf(true), 10000); // 10s
  } else {
    setShowSlowMessagePdf(false);
  }
  return () => clearTimeout(timer);
}, [videoLoading, pdfLoading]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 w-full px-4 pb-4">
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
          name="freePreview"
          render={({ field: { onChange, value }}) => (
            <FormItem className="flex items-center space-x-3 space-y-0">
              <FormLabel className="text-sky-400/60">Free Preview</FormLabel>
              <FormControl>
                <Switch
                  checked={value}
                  onCheckedChange={onChange}
                />
              </FormControl>
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
                <div className="space-y-2 overflow-hidden">
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
                    <div className="mt-2 ms-0.5 relative w-full md:w-[334px] aspect-video rounded-lg overflow-hidden bg-black/20 shadow-[0_0_7px_0.5px] shadow-sky-500/30">
                      {videoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-sky-950/45 z-10">
                          <Loader />
                          {showSlowMessageVideo && (
                            <p className="text-xs text-sky-300/60 mx-1">Still loading video... please check your connection.</p>
                          )}
                        </div>
                      )}
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
                        onLoadStart={() => setVideoLoading(true)}
                        onLoadedData={() => setVideoLoading(false)}
                        onError={() => toast.error("Failed to load video.")}                      
                        />
                    </div>
                  )}
                  {/* File name display */}
                  {form.watch('video') && (
                    <p className="text-xs text-sky-300/30 w-full mt-1 truncate">
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
        {/* pdf */}
        <FormField
          control={form.control}
          name="pdf"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <FormItem>
              <FormLabel className="text-sky-400/60">Chapter Notes/Assignment</FormLabel>
              <FormControl>
                <div className="space-y-2 overflow-hidden">
                  <Input
                    type="file"
                    accept="application/pdf"
                    className="border-sky-800 w-[258px]"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const pdfUrl = URL.createObjectURL(file);
                        setPdfPreviewUrl(pdfUrl);
                        onChange(file);
                      }
                    }}
                  />
                  {/*pdf Preview */}
                  {(pdfPreviewUrl || form.watch('pdf')) && (
                    <div className="mt-2 ms-0.5 relative w-full md:w-[334px] aspect-video rounded-lg overflow-hidden bg-black/20 shadow-[0_0_7px_0.5px] shadow-sky-500/30">
                      {pdfLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-sky-950/45 z-10">
                          <Loader />
                          {showSlowMessagePdf && (
                            <p className="text-xs text-sky-300/60 mx-1">Still loading PDF... please check your connection.</p>
                          )}
                        </div>
                      )}
                      <iframe
                        src={
                          pdfPreviewUrl ||
                          (typeof form.watch('pdf') === 'string'
                            ? `${env.AMZ_BUCKET_NAME}/${form.watch('pdf')}`
                            : form.watch('pdf') instanceof File
                              ? URL.createObjectURL(form.watch('pdf') as File)
                              : undefined)
                        }
                        className="w-full h-full"
                        onLoad={() => setPdfLoading(false)}
                        onError={() => {
                          setPdfLoading(false);
                          toast.error("Failed to load PDF.");
                        }}
                        title="PDF Preview"
                      />
                      {/* Download Button */}
                      <a
                        href={
                          pdfPreviewUrl ||
                          (typeof form.watch('pdf') === 'string'
                            ? `${env.AMZ_BUCKET_NAME}/${form.watch('pdf')}`
                            : form.watch('pdf') instanceof File
                              ? URL.createObjectURL(form.watch('pdf') as File)
                              : undefined)
                        }
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 z-20 bg-sky-700/80 hover:bg-sky-500/90 text-white text-xs px-3 py-1 rounded shadow-sm transition"
                      >
                        Open
                      </a>
                    </div>
                  )}
                  {/* File name display */}
                  {form.watch('pdf') && (
                    <p className="text-xs text-sky-300/30 w-full mt-1 truncate">
                      {form.watch('pdf') instanceof File 
                        ? `New: ${(form.watch('pdf') as File).name}`
                        : `Current: ${form.watch('pdf')}`
                      }
                    </p>
                  )}
                </div>
              </FormControl>
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
