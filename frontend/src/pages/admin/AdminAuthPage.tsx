import { SignInFormData, UserRole } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import CommonForm from "@/components/common/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema } from "@/schemas/auth"
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signinUser } from "@/store/auth/authSlice";
import { AppDispatch } from "@/store"; 
import { toast } from "sonner";
import { signInFormControl } from "@/config/helper.config"

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
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
        initial={{ scale: 2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "backIn" }}
      >
        <span className="text-[3.8rem] md:text-[15rem] font-bold text-gray-300">Credentials</span>
      </motion.div>
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen relative z-10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          className="flex  flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.5 }}
        >
          <Card className="py-8 h-[400px] w-[350px] md:w-[450px] md:h-[450px] space-y-4 bg-radial-[at_80%_20%] from-sky-900/50 to-black/40 bg-gray-100 dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-50 backdrop-blur-3xl border-sky-600/40 border-b-4">
            <motion.div
              className="mb-2"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-900">
                  Admin
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  “Trespassers Will Be Prosecuted” !
                </CardDescription>
              </CardHeader>
            </motion.div>
            <CardContent className="mt-4">
              <CommonForm
                form={form}
                onSubmit={handleSignInSubmit}
                formControls={signInFormControl}
                buttonText="SignIn"
              />
            </CardContent>
          </Card>
        </motion.div>
        </motion.div>
      </motion.div>
  );
};

export default AdminAuthPage;
