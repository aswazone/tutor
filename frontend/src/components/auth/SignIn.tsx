import { IFormControl } from "@/config"
import { SignInFormData } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import CommonForm from "../common/form"

export interface SignInProps {
    handleSignInSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    signInFormControl: IFormControl[]
    signInFormData: SignInFormData
    setSignInFormData: React.Dispatch<React.SetStateAction<SignInFormData>>
}

const SignIn: React.FC<SignInProps> = ({ handleSignInSubmit, signInFormControl, signInFormData, setSignInFormData }) => {

    function checkIsSignInValid() {
        return !signInFormData.userEmail || !signInFormData.password
    }

    return (
        <Card className="py-7 space-y-4 bg-radial-[at_80%_20%] from-sky-900/50 to-black/40 bg-gray-100 dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-50 backdrop-blur-lg border-sky-600/40 border-b-4">
            <CardHeader className="mb-2">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-900">Sign In to your account</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                    Enter your email and password to access your account !
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <CommonForm isBtnDisabled={checkIsSignInValid()} handleSubmit={handleSignInSubmit} formControls={signInFormControl} buttonText="SignIn" formData={signInFormData} setFormData={setSignInFormData} />
            </CardContent>
        </Card>
    )
}

export default SignIn