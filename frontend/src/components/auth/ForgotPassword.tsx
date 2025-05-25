import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { CredenzaBody, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle } from "../ui/credenza"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Loader from "../ui/loader"
import { forgetPasswordSchema } from "@/schemas/auth"
import { AppDispatch, RootState } from "@/store"
import { useDispatch, useSelector } from "react-redux"
import { forgotPassword } from "@/store/auth/authSlice"



const ForgetPassword = () => {
    const {isLoading} = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch<AppDispatch>()

    const form = useForm<z.infer<typeof forgetPasswordSchema>>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof forgetPasswordSchema>) => {
        try {
            const response = await dispatch(forgotPassword({email:data.email}))
            if (forgotPassword.fulfilled.match(response)) {
                toast.success(response.payload.message);
                localStorage.setItem("email", data.email);
            } else if (forgotPassword.rejected.match(response)) {
                toast.error(response.payload);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    }
    return (
        <CredenzaContent className="bg-gradient-to-br from-sky-900/20 backdrop-blur-sm via-sky-950 to-sky-900/10 border-2 border-sky-900/40">
            <CredenzaHeader>
                <CredenzaTitle>Forget Password</CredenzaTitle>
                <CredenzaDescription>
                    Fill Out Your Existing Email To Sent The Link
                </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <CredenzaFooter>
                            <Button variant={"outline"} className="rounded-bl-none rounded-tr-none " disabled={isLoading} type="submit">
                                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                Submit
                            </Button>
                        </CredenzaFooter>
                    </form>
                </Form>
            </CredenzaBody>

        </CredenzaContent>
    )
}

export default ForgetPassword