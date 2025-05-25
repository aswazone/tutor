import { IFormControl } from "@/config"
import { SignInFormData } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import CommonForm from "../common/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "@/schemas/auth"
import GoogleAuth from "./GoogleAuth"
import { Credenza, CredenzaTrigger } from "../ui/credenza"
import ForgetPassword from "./ForgotPassword"
import { Button } from "../ui/button"

export interface SignInProps {
    handleSignInSubmit: (data: SignInFormData) => void;
    signInFormControl: IFormControl[];
}

const SignIn: React.FC<SignInProps> = ({ handleSignInSubmit, signInFormControl }) => {
    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            userEmail: "",
            password: "",
        },
    });

    return (
        <Card className="py-7 space-y-4 bg-radial-[at_80%_20%] from-sky-900/50 to-black/40 bg-gray-100 dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-50 backdrop-blur-lg border-sky-600/40 border-b-4">
            <CardHeader className="mb-2">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-900">Sign In to your account</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                    Enter your email and password to access your account !
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <CommonForm 
                    form={form}
                    onSubmit={handleSignInSubmit}
                    formControls={signInFormControl} 
                    buttonText="SignIn"
                />

                <Credenza>
                    <CredenzaTrigger asChild>
                        <Button variant={"link"} className="text-xs font-bold text-sky-600 hover:text-sky-400 hover:underline">Forgot your password?</Button>
                    </CredenzaTrigger>
                    <ForgetPassword/>
                </Credenza>
                
                <GoogleAuth />
            </CardContent>
        </Card>
    )
}

export default SignIn