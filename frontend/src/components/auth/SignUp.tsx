import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form'
import { SignUpFormData } from '@/types'
import { IFormControl } from '@/config'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema } from '@/schemas/auth'

export interface SignUpProps {
    handleSignUpSubmit: (data: SignUpFormData) => void;
    signUpFormControl: IFormControl[];
}

const SignUp = ({ handleSignUpSubmit, signUpFormControl }: SignUpProps) => {
    const form = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            userName: "",
            userEmail: "",
            password: "",
        },
    });
    
    return (
        <Card className="py-7 space-y-4 bg-radial-[at_20%_80%] from-sky-900/40 to-black/50 bg-gray-100 dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-50 backdrop-blur-lg border-sky-600/40 border-b-4">
            <CardHeader className="mb-2">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-900">Create a new account</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                    Enter your email and password to create a new account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <CommonForm 
                    form={form}
                    onSubmit={handleSignUpSubmit}
                    formControls={signUpFormControl} 
                    buttonText="SignUp"
                />
            </CardContent>
        </Card>
    )
}

export default SignUp;