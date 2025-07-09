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
import { CheckUserStatus } from "./CheckUserStatus";
import AllCourses from "@/pages/courses";
import CourseDetailsPage from "@/pages/courses/course";
import MyCourses from "@/pages/courses/my-courses";
import CourseProgressPage from "@/pages/courses/course-progress";
import Revenue from "@/pages/admin/Revenue";
import Chat from "@/pages/chat";


export const router = createBrowserRouter([

    {
        path: "*", element: <NotFoundPage />,
        errorElement: <ErrorPage />
    },
    {
        path: "", element: <CheckUserStatus><AppLayout /></CheckUserStatus>,
        children: [
            {
                path: "/", element: <LandingPage />,
            },
            {
                path: "home", element: <Home />,
            },
            {
                path: "courses", element: <AllCourses />,
            },
            {
                path: "course/:id", element: <CourseDetailsPage />,
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
            },
            {
                path: "my-courses", element: <ProtectedRoutes><MyCourses /></ProtectedRoutes>
            },
            {
                path: "course-progress/:id", element: <ProtectedRoutes><CourseProgressPage /></ProtectedRoutes>
            },
            {
                path: "chat", element: <ProtectedRoutes><Chat /></ProtectedRoutes>
            },
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
            },
            {
                path: "revenue", element: <Revenue />
            },
        ]
    },
    {
        path: "/admin/auth", element: <UnProtectedRoutes><AdminAuthPage /></UnProtectedRoutes>,
    },
    {
        path: "reset-password", element: <ResetPassword /> 
    },

])