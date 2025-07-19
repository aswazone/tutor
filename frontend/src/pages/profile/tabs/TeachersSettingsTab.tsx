import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ChangePasswordFormData, changePasswordSchema, ProfileSettingsFormData, profileSettingsSchema } from '@/schemas/settings'
import { useEffect, useState } from "react"
import axiosInstance from "@/config/axios.config"

const TeachersSettingsTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [changedPassword, setChangedPassword] = useState(false)

  const form = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      qualification: "",
      about: "",
      expertise: "",
    },
  })

  const form2 = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function handleProfileUpdate(data: ProfileSettingsFormData) {
    try {
      setIsSubmitting(true)
        const response = await axiosInstance.patch('/api/v1/auth/profile-update',{
          tutorDetails:data
        })
        if(response.data){
          toast.success("Settings updated successfully!")
        }
        
    } catch (error) {
      toast.error("Failed to update settings")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordChange = async (data: ChangePasswordFormData) => {
    try {
      setIsSubmitting(true)
      // TODO: Replace with actual API call
      
      console.log(data)
      setChangedPassword(true)
      toast.success("Settings updated successfully!")
    } catch (error) {
      toast.error("Failed to update settings")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }


    useEffect(()=>{
      if(changedPassword){
        setTimeout(() => {
          form2.reset()
          setChangedPassword(false)
        }, 3000)
      }
    },[changedPassword, form2])

  return (
    <div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-8">
        {/* Profile Settings */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mt-3">Teaching Profile</h3>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior JavaScript Instructor" {...field} />
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
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell students about your teaching experience and expertise..."
                      className="min-h-[120px]"
                      {...field}
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
                  <FormLabel>Areas of Expertise</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. JavaScript, React, Node.js" {...field} />
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
    <hr className="my-8" />
    <Form {...form2}>
      <form onSubmit={form2.handleSubmit(handlePasswordChange)} className="space-y-4">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-4">
            <FormField
              control={form2.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your current password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form2.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form2.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your confirm password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Wait..." : "Change Password"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form2.reset()}
          >
            Cancel Changes
          </Button>
          </div>
          {changedPassword 
          ? <div className="animate-in fade-in duration-100 transition-all bg-primary-foreground/65 h-25 text-center border-1 border-sky-800/70 outline-5 outline-primary-foreground my-auto p-8 rounded-md">Password Changed !</div>
          :(<div className="animate-in fade-out duration-100 transition-all bg-primary-foreground/65 p-5 rounded-md">
            <h3 className="text-xl mb-4 text-sky-800/90 font-semibold">Password Requirements</h3>
            <ul className="list-disc list-inside text-[8px] md:text-sm text-sky-200/80">
              <li>The current password must be corrected</li>
              <li>Create a strong password with:</li>
              <li><strong>Minimum 8 characters</strong></li>
              <li><strong>At least one uppercase letter</strong></li>
              <li><strong>At least one lowercase letter</strong></li>
              <li><strong>At least one number</strong></li>
              <li><strong>At least one special character</strong></li>
            </ul>
          </div>)}
        </div>
      </form>
    </Form>
    </div>
  )
}

export { TeachersSettingsTab }