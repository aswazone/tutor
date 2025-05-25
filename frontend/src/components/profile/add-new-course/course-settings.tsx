import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Button } from "@/components/ui/button"

// File size & type config
const MAX_FILE_SIZE = 6 * 1024 * 1024 // 6MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

// Schema with better file handling
const courseSettingsSchema = z.object({
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size is 6MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
})

type CourseSettingsFormValues = z.infer<typeof courseSettingsSchema>

interface CourseSettingsProps {
  courseImage: File | null
  handleInputChange: (file: File | null) => void
}

const CourseSettings = ({ handleInputChange, courseImage }: CourseSettingsProps) => {
  const form = useForm<CourseSettingsFormValues>({
    resolver: zodResolver(courseSettingsSchema),
    defaultValues: {
      image: undefined,
    },
  })

  const onSubmit = (data: CourseSettingsFormValues) => {
    handleInputChange(data.image)
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
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Upload Course Image</FormLabel>
                  <FormControl>                    
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="border-sky-800"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          onChange(file)
                        }}
                      />
                      {courseImage && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected file: {courseImage.name}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
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
