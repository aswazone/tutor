import { IFormControl, signInFormControl } from "@/config"
import { SignInFormData, UserRole } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import CommonForm from "@/components/common/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "@/schemas/auth"

export interface SignInProps {
    handleSignInSubmit: (data: SignInFormData) => void;
    signInFormControl: IFormControl[];
}




// const AuthSignIn: React.FC<SignInProps> = ({ handleSignInSubmit, signInFormControl }) => {
//     const form = useForm<SignInFormData>({
//         resolver: zodResolver(signInSchema),
//         defaultValues: {
//             userEmail: "",
//             password: "",
//         },
//     });

//     return (
//         <Card className="py-7 space-y-4 bg-radial-[at_80%_20%] from-sky-900/50 to-black/40 bg-gray-100 dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-50 backdrop-blur-lg border-sky-600/40 border-b-4">
//             <CardHeader className="mb-2">
//                 <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-900">Sign In to your account</CardTitle>
//                 <CardDescription className="text-xs text-gray-500">
//                     Enter your email and password to access your account !
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-2">
//                 <CommonForm 
//                     form={form}
//                     onSubmit={handleSignInSubmit}
//                     formControls={signInFormControl} 
//                     buttonText="SignIn"
//                 />
//                 <Link to="/forgot-password" className="text-xs font-bold text-sky-600 hover:text-sky-400 hover:underline">Forgot your password?</Link>
//                 <div className="mt-4">
//                     <Link to="/auth/google" className="w-full border-1 rounded-md flex justify-center hover:bg-gradient-to-r hover:from-sky-900/10 hover:via-sky-950 hover:to-sky-900/10">
//                         <img className="w-7 h-7 my-1" src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
//                     </Link>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signinUser } from "@/store/auth/authSlice";
import { AppDispatch } from "@/store"; 
import { toast } from "sonner";

const AdminAuthPage: React.FC = () => {
    const role = UserRole.ADMIN;


    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            userEmail: "",
            password: "",
        },
    });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  

  async function handleSignInSubmit(data: SignInFormData) {

    console.log(data);
    try {
      if (role !== null) {
        const resultAction = await dispatch(signinUser({ role, ...data }));
        if (signinUser.fulfilled.match(resultAction)) {
          console.log(resultAction.payload);
          localStorage.setItem("accessToken", resultAction.payload?.accessToken);
          toast.success("Welcome Admin !!");
          navigate("/admin");
        } else if (signinUser.rejected.match(resultAction)) {
          toast.error(resultAction.payload);
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred");
    }
  }


  return (
    <motion.div
      className="relative flex flex-col mx-4 min-h-screen bg-opacity-10 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <span className="text-[15rem] font-bold text-gray-300">Credentials</span>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="flex  flex-col items-center justify-center">
          
        <Card className="py-7 w-[350px] space-y-4 bg-radial-[at_80%_20%] from-sky-900/50 to-black/40 bg-gray-100 dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-50 backdrop-blur-lg border-sky-600/40 border-b-4">
            <CardHeader className="mb-2">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-900">Admin</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                    “Trespassers Will Be Prosecuted” !
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <CommonForm 
                    form={form}
                    onSubmit={handleSignInSubmit}
                    formControls={signInFormControl} 
                    buttonText="SignIn"
                />
            </CardContent>
        </Card>
          
        </div>
      </div>
    </motion.div>
  );
};

export default AdminAuthPage;
