import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { studentSettingsSchema, StudentSettingsFormData } from '@/schemas/settings'
import { useState } from "react"

const StudentsSettingsTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<StudentSettingsFormData>({
    resolver: zodResolver(studentSettingsSchema),
    defaultValues: {
      interests: "",
      goals: "",
      experienceLevel: "beginner",
      courseRecommendations: true,
      studyReminders: true,
      preferredTime: "morning",
      emailUpdates: true,
      learningProgress: true,
    },
  })

  async function onSubmit(data: StudentSettingsFormData) {
    try {
      setIsSubmitting(true)
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(data)
      toast.success("Settings updated successfully!")
    } catch (error) {
      toast.error("Failed to update settings")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Learning Profile */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Learning Profile</h3>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Interests</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Web Development, Data Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What do you want to achieve through our platform?"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>


        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
          >
            Cancel Changes
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { StudentsSettingsTab }