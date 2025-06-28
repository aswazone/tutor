import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

const moduleFormSchema = z.object({
  title: z.string()
    .trim()
    .min(5, "Title is required, at least 5 characters")
    .nonempty("Title cannot be empty or whitespace"),
  description: z.string()
    .trim()
    .min(8, "Description is required, at least 8 characters")
    .nonempty("Description cannot be empty or whitespace"),
})

type ModuleFormValues = z.infer<typeof moduleFormSchema>

interface ModuleFormProps {
  onSubmit: (values: ModuleFormValues) => void
  onCancel: () => void
  initialData?: ModuleFormValues
}

export function ModuleForm({ onSubmit, onCancel, initialData }: ModuleFormProps) {
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full px-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-sky-400/60">Module Title</FormLabel>
              <FormControl>
                <Input className="border-sky-800 " placeholder="Enter module title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sky-400/60">Module Description</FormLabel>
              <FormControl>
                <Textarea className="border-sky-800" placeholder="Enter module description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 justify-end">
          <Button className="border rounded-tl-none rounded-br-none bg-red-700/5 text-red-400/60 hover:text-red-400/80 hover:bg-red-950/30" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="border rounded-tl-none rounded-br-none bg-sky-500/10 text-sky-400/60 hover:text-sky-400/80 hover:bg-sky-950/30" type="submit">Save Module</Button>
        </div>
      </form>
    </Form>
  )
}
