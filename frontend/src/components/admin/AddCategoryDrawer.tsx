import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  isListed: z.boolean(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface AddCategoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  title?: string;
  description?: string;
  initialData?: CategoryFormData;
}

export function AddCategoryDrawer({
  open,
  onOpenChange,
  onSubmit,
  title = "Add New Category",
  description = "Create a new category for courses.",
  initialData
}: AddCategoryDrawerProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      isListed: true,
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (err) {
        toast.error(err as string)
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DrawerHeader className="w-full md:w-1/2 md:mx-auto">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4 w-full md:w-1/2 md:mx-auto">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isListed"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Listed Status</FormLabel>
                      <FormDescription>
                        {field.value
                          ? "Category is visible and available"
                          : "Category is hidden from users"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DrawerFooter className="w-full md:w-1/2 md:mx-auto">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Saving..." : "Save Category"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
