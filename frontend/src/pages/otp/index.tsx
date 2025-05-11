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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Loader2 } from "lucide-react";
import { verifyOtp } from "@/store/auth/authSlice";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

const OtpForm = () => {

  const {isLoading} = useSelector((state:RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail"); 
    if (!storedEmail) {
      navigate("/auth");
    } else {
      setEmail(storedEmail);
    }
    return () =>{
      setEmail(null);
    } 
  }, [navigate]);


  

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {

    try {
      if(email && data.pin){
        const resultAction = await dispatch(verifyOtp({ otp: data.pin, email }));
        if(resultAction){
          if (verifyOtp.fulfilled.match(resultAction)) {
            toast.success("Successfully verified !!");
            localStorage.removeItem("pendingEmail");
            navigate("/home");
          } else if (verifyOtp.rejected.match(resultAction)) {
            toast.error(resultAction.payload);
          }
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  }

  return (
    email && <section className="container grid lg:grid-cols-2 place-items-center p-3 md:p-20 md:py-32 gap-10">
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
          {email}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your phone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            { isLoading
            ? <Button disabled={isLoading} variant={"outline"} type="submit" className="bg-background">
                <Loader2 className="animate-spin" /> wait..
              </Button> 
            : <Button variant={"outline"} type="submit" className="bg-background">Submit</Button>}
          </form>
        </Form>
      </motion.div>
  
      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );

  
}

export default OtpForm;