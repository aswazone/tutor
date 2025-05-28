import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { env } from "@/config/env.config"
import { useState, useEffect } from 'react'
import { uploadSingleImageFile } from "@/store/course"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"

// File size & type config
const MAX_FILE_SIZE = 6 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

interface CourseSettingsProps {
  courseImage: File | null | string;
  handleInputChange: (imageKey: string | null) => void
}

interface FormValues {
  image: File | string | null;
}

const CourseSettings = ({ handleInputChange, courseImage }: CourseSettingsProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<FormValues>({
    defaultValues: {
      image: courseImage || null,
    }
  })

  useEffect(() => {
    // Cleanup function to revoke preview URL when component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateImage = (file: File | string | null) => {
    if (!file) {
      return "Course image is required";
    }

    if (file instanceof File) {
      if (file.size > MAX_FILE_SIZE) {
        return "Image size should be less than 6MB";
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return "Only .jpg, .jpeg, .png and .webp formats are supported";
      }
    }

    return true;
  }

  const onSubmit = async (data: FormValues) => {
    const validationResult = validateImage(data.image);
    
    if (validationResult === true) {

      console.log("Course image:", data.image);
      if(data.image instanceof File) {
        const uploadedImage = await dispatch(uploadSingleImageFile({ courseImage: data.image })).unwrap();
        handleInputChange(uploadedImage.thumbnailKey);
      }else{
        handleInputChange(data.image);
      }
      toast.success("Image updated successfully !");
    } else {
      toast.error(validationResult);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel>Upload Course Image</FormLabel>
                  <FormControl>                    
                    <div>
                      <Input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        className="border-sky-800"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Create preview URL for the new file
                            const fileUrl = URL.createObjectURL(file);
                            setPreviewUrl(fileUrl);
                            onChange(file);
                          }
                        }}
                      />
                      {courseImage && (
                        <p className="text-xs text-sky-300/30 truncate mt-1">
                          {typeof courseImage === 'string' 
                            ? `Current: ${courseImage.split('/').pop()}`
                            : `Selected: ${courseImage.name}`
                          }
                        </p>
                      )}
                      {courseImage && <div className="mt-2 relative w-full aspect-video rounded-lg overflow-hidden">
                        {previewUrl ? (
                          <img 
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : typeof courseImage === 'string' ? (
                          <img 
                            src={`${env.AMZ_BUCKET_NAME}/${courseImage}`}
                            alt="Current thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : courseImage instanceof File ? (
                          <img 
                            src={URL.createObjectURL(courseImage)}
                            alt="Selected thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>}
                    </div>
                  </FormControl>
                  {error && <FormMessage>{error.message}</FormMessage>}
                </FormItem>
              )}
            />

            <Button type="submit" className="w-fit">
              Save & Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CourseSettings