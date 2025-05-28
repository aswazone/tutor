import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import googleIcon from "@/assets/google-icon.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { googleSignin } from "@/store/auth/authSlice";
import Loader from "../ui/loader";

const GoogleAuth: React.FC = () => {
    const navigate = useNavigate();
    const {isLoading} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const googleLogin = useGoogleLogin({
        onSuccess: async (res) => {
            const response = await dispatch(googleSignin({token: res.access_token}));
            if(googleSignin.fulfilled.match(response)){
                localStorage.removeItem("userRole");
                navigate("/home");
                toast(`Welcome Back !`);
            }else{
                toast.error(response.payload);
            }
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    return (

        <Button
            type="button"
            className="w-full mt-4 border-1 rounded-md bg-transparent flex justify-center hover:bg-gradient-to-r hover:from-sky-900/10 hover:via-sky-950 hover:to-sky-900/10"            onClick={() => googleLogin()}
            onError={() => toast.error("Google login failed")}
        >
           {isLoading ? <Loader /> : (<img className="w-4 h-4" src={googleIcon} alt="google icon" />)}
        </Button>
    );
};

export default GoogleAuth;