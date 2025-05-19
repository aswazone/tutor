import { RootState } from "@/store"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { Switch } from "@/components/ui/switch"



const settingsFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  education: z.string().min(2, "Education must be at least 2 characters"),
  notifications: z.boolean(),
})


export const SettingsTab = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    const userData = user as Record<string, unknown> | null
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
  
    const defaultValues: z.infer<typeof settingsFormSchema> = {
      name: (userData?.name || userData?.userName || "").toString(),
      email: (userData?.userEmail || "").toString(),
      bio: "Frontend developer passionate about creating beautiful user experiences.",
      education: "Computer Science at University XYZ",
      notifications: true,
    }
  
    const form = useForm({
      resolver: zodResolver(settingsFormSchema),
      defaultValues,
    })
  
    const onSubmit = form.handleSubmit(async (data) => {
      try {
        setIsLoading(true)
        // TODO: Implement profile update API call
        console.log('Updating profile with:', data)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        toast.success("Profile updated successfully!")
      } catch (err) {
        console.error('Failed to update profile:', err)
        toast.error("Failed to update profile")
      } finally {
        setIsLoading(false)
      }
    })
  
    async function handleProfilePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]
      if (!file) return
  
      try {
        setIsUploading(true)
        // TODO: Implement photo upload API call
        console.log('Uploading file:', file.name)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate upload
        toast.success("Profile photo updated!")
      } catch (err) {
        console.error('Failed to upload photo:', err)
        toast.error("Failed to update profile photo")
      } finally {
        setIsUploading(false)
      }
    }
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={userData?.profileImage || "https://i.pravatar.cc/150?img=67"}
                alt={userData?.userName || "User Avatar"}
              />
              <AvatarFallback>
                {userData?.userName ? userData.userName.slice(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Profile Photo</h3>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  disabled={isUploading}
                  className="max-w-[250px]"
                />
                {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </div>
          </div>
  
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Write a short bio about yourself. This will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notifications</FormLabel>
                      <FormDescription>
                        Receive notifications about your courses and students.
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
  
              <div className="space-y-4">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
  
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // TODO: Implement password change
                    toast.info("Password change functionality coming soon!")
                  }}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    )
  }