import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControl, signUpFormControl } from "@/config";
import { SignInFormData, SignUpFormData, UserRole } from "@/types";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signinUser, signupUser } from "@/store/auth/authSlice";
import { AppDispatch } from "@/store"; 
import { toast } from "sonner";

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null; 
    if (!storedRole) {
      navigate("/pre-auth");
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  if (!role) return null;

  

  function handleTabChange(value: string) {
    setActiveTab(value);
  }

  async function handleSignInSubmit(data: SignInFormData) {
    console.log(data);
    try {
      if (role !== null) {
        const resultAction = await dispatch(signinUser({ role, ...data }));
        if (signinUser.fulfilled.match(resultAction)) {
          console.log(resultAction.payload);
          toast.success("Successfully Logged In !!");
          localStorage.removeItem("userRole");
          navigate("/home");
        } else if (signinUser.rejected.match(resultAction)) {
          toast.error(resultAction.payload);
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred");
    }
  }

  async function handleSignUpSubmit(data: SignUpFormData) {
    try {
      if (role !== null) {
        const resultAction = await dispatch(signupUser({ role, ...data }));
        if (signupUser.fulfilled.match(resultAction)) {
          console.log(resultAction.payload);
          localStorage.removeItem("userRole");
          localStorage.setItem("pendingEmail", resultAction.payload?.userEmail);
          navigate("/otp-verification");
        } else if (signupUser.rejected.match(resultAction)) {
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
        <span className="text-[15rem] font-bold text-gray-300">To{role === "tutor" ? " Teach" : " Learn"}</span>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="flex flex-col items-start">
          
          <Tabs defaultValue="signin" value={activeTab} className="w-[360px] md:w-[450px] mt-4">
            <motion.div
              className="grid w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between w-full">
              <TabsList className="from-sky-900/50 via-black to-sky-900/50 text-sky-600 shadow-sm rounded-lg overflow-hidden border border-sky-900/10 bg-conic-210">
                <TabsTrigger value="signin" onClick={() => handleTabChange("signin")}>Sign In</TabsTrigger>
                <TabsTrigger value="signup" onClick={() => handleTabChange("signup")}>Sign Up</TabsTrigger>
              </TabsList>
              <Link to={"/pre-auth"} className="bg-background text-center pt-2 w-[60px] py-1 px-2 from-sky-900/50 via-black to-sky-900/50 text-sm text-gray-300 shadow-sm rounded-lg overflow-hidden border border-sky-900/10 bg-conic-210 relative z-10">Back</Link>
              </div>
            </motion.div>
            <TabsContent value="signin">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <SignIn
                  handleSignInSubmit={handleSignInSubmit}
                  signInFormControl={signInFormControl}
                />
              </motion.div>
            </TabsContent>
            <TabsContent value="signup">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <SignUp
                  handleSignUpSubmit={handleSignUpSubmit}
                  signUpFormControl={signUpFormControl}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;