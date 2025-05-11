import { IFormControl } from "@/config"
import { SignInFormData } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import CommonForm from "../common/form"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "@/schemas/auth"

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
                <Link to="/forgot-password" className="text-xs font-bold text-sky-600 hover:text-sky-400 hover:underline">Forgot your password?</Link>
                <div className="mt-4">
                    <Link to="/auth/google" className="w-full border-1 rounded-md flex justify-center hover:bg-gradient-to-r hover:from-sky-900/10 hover:via-sky-950 hover:to-sky-900/10">
                        <img className="w-7 h-7 my-1" src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default SignIn