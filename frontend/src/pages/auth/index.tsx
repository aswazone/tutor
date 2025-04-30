import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { initialStateOfSignInFormData, initialStateOfSignUpFormData, signInFormControl, signUpFormControl } from "@/config";
import { SignInFormData, SignUpFormData } from "@/types";
import { useState } from "react"
import { Link } from "react-router-dom"

const AuthPage: React.FC = () => {

  const [activeTab, setActiveTab] = useState("signin");
  const [signInFormData, setSignInFormData] = useState<SignInFormData>(initialStateOfSignInFormData); 
  const [signUpFormData, setSignUpFormData] = useState<SignUpFormData>(initialStateOfSignUpFormData);

  function handleTabChange(value: string) {
    setActiveTab(value);
  }

  function handleSignInSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(signInFormData);
    console.log('signin');
  }
  function handleSignUpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(signUpFormData);
    console.log('signup');
  }

  return (

    <div className="flex flex-col min-h-screen bg-opacity-10 backdrop-blur-lg">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-sky-900">
        <Link to={"/"} className="flex items-center justify-center"><span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-900 text-2xl">Tutor</span></Link>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="signin" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2 from-sky-900/50 via-black to-sky-900/50 text-sky-600 shadow-sm rounded-lg overflow-hidden border border-sky-900/10 bg-conic-210">
            <TabsTrigger  value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignIn handleSignInSubmit={handleSignInSubmit} signInFormControl={signInFormControl} signInFormData={signInFormData} setSignInFormData={setSignInFormData} />
          </TabsContent>
          <TabsContent value="signup">
            <SignUp handleSignUpSubmit={handleSignUpSubmit} signUpFormControl={signUpFormControl} signUpFormData={signUpFormData} setSignUpFormData={setSignUpFormData} /> 
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AuthPage