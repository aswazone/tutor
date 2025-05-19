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
                path: "auth", element: <AuthPage />,
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
            }
        ]
    },
    {
        path: "/admin/auth", element: <UnProtectedRoutes><AdminAuthPage /></UnProtectedRoutes>,
    },

])