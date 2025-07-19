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
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"
import { updatePassword } from "@/store/auth/authSlice"
import axiosInstance from "@/config/axios.config"

const StudentsSettingsTab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [changedPassword, setChangedPassword] = useState(false)
  const dispatch = useDispatch<AppDispatch>();

  const form1 = useForm<ProfileSettingsFormData>({
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
            studentDetails:data
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

  const handlePasswordChange = async (data: ChangePasswordFormData) =>{
    try {
      setIsSubmitting(true)
      console.log(data)
      const resultAction = await dispatch(updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }));

      if(updatePassword.fulfilled.match(resultAction)){

        console.log(resultAction.payload);
        setChangedPassword(true)

      }else if(updatePassword.rejected.match(resultAction)){
        toast.error(resultAction.payload)
      }
      // TODO: Replace with actual API call
    } catch (error) {
      toast.error("Failed to change password")
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
      <Form {...form1}>
      <form onSubmit={form1.handleSubmit(handleProfileUpdate)} className="space-y-8">
        {/* Profile Settings */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mt-3">Learning Profile</h3>
          <div className="grid gap-4">
            <FormField
              control={form1.control}
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Highest Qualification</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bsc Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form1.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell about yourself and love to do..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form1.control}
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
            onClick={() => form1.reset()}
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
            :<div className="animate-in fade-out duration-100 transition-all bg-primary-foreground/65 p-5 rounded-md">
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
            </div>}
          </div>
        </form>
      </Form>
    </div>
  )
}

export { StudentsSettingsTab }