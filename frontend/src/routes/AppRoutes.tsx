import AppLayout from "@/layout/AppLayout";
import AuthPage from "@/pages/auth";
import LandingPage from "@/pages/landing";
import NotFoundPage from "@/pages/not-found";
import OtpForm from "@/pages/otp";
import Profile from "@/pages/profile";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/", element: <LandingPage />,
    },
    {
        path: "*", element: <NotFoundPage />,
    },
    {
        path: "", element: <AppLayout />,
        children: [
            {
                path: "profile", element: <Profile />,
            },
        ]
    },
    {
        path: "auth", element: <AuthPage />,
    },
    {
        path: "otp-verification", element: <OtpForm />
    }
])