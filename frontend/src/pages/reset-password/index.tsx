import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion";

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Loader2 } from "lucide-react";
import { resetPassword } from "@/store/auth/authSlice";
import { ResetPasswordFormSchema } from "@/schemas/auth";
import { useEffect, useState } from "react";


const ResetPassword = () => {

  const {isLoading} = useSelector((state:RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams]= useSearchParams();
  const [cachedData, setCachedData] = useState({email:"",token:""});
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = localStorage.getItem("email") as string;
    if (token) {
      setCachedData({ token, email });
    }
  }, [searchParams]);

  

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: z.infer<typeof ResetPasswordFormSchema>) {

    try {

        console.log(cachedData);
        if (!cachedData.token) toast.error("Token is required");
        if(cachedData.token && data.password){

            const resultAction = await dispatch(resetPassword({ token: cachedData.token, password: data.password }));
            if (resetPassword.fulfilled.match(resultAction)) {
            toast.success("Password reset successfully");
            localStorage.removeItem("email");
            navigate("/auth");
            } else if (resetPassword.rejected.match(resultAction)) {
            toast.error(resultAction.payload);
            }
        }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  }

  return (
    
     <section className="container grid md:grid-cols-2 h-screen place-items-center mx-auto p-3 md:p-20 md:py-32 gap-10">
      <motion.div
        className="text-center lg:text-start space-y-6"
        initial={{ x: "-100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        <main className="text-5xl md:text-6xl font-bold ">
          <h1 className="inline">
            <span className="inline sm:text-2xl md:text-8xl bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Tutor
            </span>{" "}
          </h1>{" "}
          <h2 className="inline">
            <span className="block sm:text-2xl md:text-8xl bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text pb-4">
            E-learning
            </span>{" "}
          </h2>
        </main>
  
        <p className="text-xs md:text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Learn from industry-leading developers and master the hottest skills right from your cozy corner at home. 
        </p>
  
      </motion.div>
  
      <motion.div
        className="z-10"
        initial={{ x: "100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50}}
      >Verifying as 
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#741a6bdf] via-[#1fc0f1] to-[#8fd1e679] mb-6">
          {cachedData.email}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="Enter new password" />
                  </FormControl>
                  <FormDescription className="hidden md:block text-xs">
                    Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="Confirm your password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? (
              <Button disabled variant="outline" type="submit" className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
              </Button>
            ) : (
              <Button variant="outline" type="submit" className="w-full">
                Reset Password
              </Button>
            )}
          </form>
        </Form>
      </motion.div>
  
      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );

  
}

export default ResetPassword;
