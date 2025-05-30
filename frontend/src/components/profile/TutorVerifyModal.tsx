import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { useState } from "react"
import { toast } from "sonner"
import axiosInstance from "@/config/axios.config"

const formSchema = z.object({
  qualification: z.string().min(2, {
    message: "Qualification must be at least 2 characters.",
  }),
  experience: z.number().min(0, {
    message: "Experience must be a positive number",
  }),
  expertise: z.string().min(2, {
    message: "Expertise must be at least 2 characters.",
  }),
  about: z.string().min(10, {
    message: "About must be at least 10 characters.",
  }),
})

interface TutorVerifyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  tutorId: string
}

export function TutorVerifyModal({ isOpen, onClose, onSuccess ,tutorId}: TutorVerifyModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),    
    defaultValues: {
      qualification: "",
      experience: 1,
      expertise: "",
      about: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("qualification", values.qualification)
      formData.append("experience", values.experience.toString())
      formData.append("expertise", values.expertise)
      formData.append("about", values.about)
      if (file) {
        console.log('file added');
        const fileName = file.name
        formData.append("resume", fileName)
      }

      console.log(tutorId, 'tutor id');
      // return

      await axiosInstance.patch(`/api/v1/auth/tutor-verify/${tutorId}/pending`, formData)

      toast.success("Verification request sent successfully!")
      onSuccess()
      onClose()
    } catch (error) {
        console.error("Error sending verification request:", error)
        toast.error("Failed to send verification request")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "application/pdf") {
        console.log(selectedFile);
        setFile(selectedFile)
      } else {
        toast.error("Please upload a PDF file")
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border border-sky-900/40">
        <DialogHeader>
          <DialogTitle>Tutor Verification</DialogTitle>
          <DialogDescription>
            Please provide your details for tutor verification.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highest Qualification</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bachelor's in Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>                  
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 2" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area of Expertise</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Web Development, Machine Learning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Yourself</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your teaching experience and why you want to become a tutor..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Resume/CV (Optional)</FormLabel>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="file:bg-sky-900/20 file:text-sky-500 file:border-0 file:rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-sky-900/40"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={loading}
                className="text-white bg-gradient-to-br from-sky-900/30 to-sky-900/60 
                  border border-sky-800/30 hover:from-sky-900/40 hover:to-sky-900/70"
              >
                {loading ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
