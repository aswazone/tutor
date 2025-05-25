import AppLayout from "@/layout/AppLayout";
import AuthPage from "@/pages/auth";
import Home from "@/pages/home";
import LandingPage from "@/pages/landing";
import NotFoundPage from "@/pages/not-found";
import OtpForm from "@/pages/otp";
import PreAuth from "@/pages/preAuth";
import Profile from "@/pages/profile";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import UnProtectedRoutes from "./UnProtectedRoutes";
import ErrorPage from "@/pages/error";
import AdminLayout from "@/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminAuthPage from "@/pages/admin/AdminAuthPage";
import Courses from "@/pages/admin/Courses";
import Tutors from "@/pages/admin/Tutors";
import Students from "@/pages/admin/Students";
import Categories from "@/pages/admin/Categories";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { env } from "@/config/env.config";
import ResetPassword from "@/pages/reset-password";


export const router = createBrowserRouter([

    {
        path: "*", element: <NotFoundPage />,
        errorElement: <ErrorPage />
    },
    {
        path: "", element: <AppLayout />,
        children: [
            {
                path: "/", element: <LandingPage />,
            },
            {
                path: "home", element: <Home />,
            },
            {
                path: "profile", element: <ProtectedRoutes><Profile /></ProtectedRoutes>,
            },
            {
                path: "pre-auth", element: <UnProtectedRoutes><PreAuth /></UnProtectedRoutes>,
            },
            {
                path: "auth", element: <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}><AuthPage /></GoogleOAuthProvider>,
            },
            {
                path: "otp-verification", element: <OtpForm />
            }
        ]
    },
    {
        path:"/admin", element: <ProtectedRoutes><AdminLayout /></ProtectedRoutes>,
        children: [
            {
                path: "", element: <AdminDashboard />
            },
            {
                path: "courses", element: <Courses />
            },
            {
                path: "tutors", element: <Tutors />
            },
            {
                path: "students", element: <Students />
            },
            {
                path: "categories", element: <Categories />
            }
        ]
    },
    {
        path: "/admin/auth", element: <UnProtectedRoutes><AdminAuthPage /></UnProtectedRoutes>,
    },
    {
        path: "reset-password", element: <ResetPassword /> 
    }

])