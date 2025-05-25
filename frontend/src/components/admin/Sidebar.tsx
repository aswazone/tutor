import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  BarChart3,
  ListTree,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { RootState } from "@/store";
import logo from "../../assets/new.svg";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ className, isCollapsed, setIsCollapsed }: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      color: "text-sky-500",
    },
    {
      label: "Courses",
      icon: BookOpen,
      href: "/admin/courses",
      color: "text-violet-500",
    },
    {
      label: "Tutors",
      icon: GraduationCap,
      color: "text-pink-700",
      href: "/admin/tutors",
    },
    {
      label: "Students",
      icon: Users,
      color: "text-amber-300",
      href: "/admin/students",
    },
    {
      label: "Categories",
      icon: ListTree,
      color: "text-rose-400",
      href: "/admin/categories",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      color: "text-emerald-500",
      href: "/admin/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        // Glassmorphism and shadow
        "group sticky flex flex-col h-screen transition-all duration-300 top-0 z-50",
        "bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/60 backdrop-blur-md shadow-2xl border-r border-gray-800/60",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-3 py-3 border-b border-sky-700/35",
        "bg-gradient-to-br from-sky-800/20 via-sky-600/30 to-sky-900/25"
      )}>
        <div className="flex items-center gap-2" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="h-9 w-9 bg-sky-600/50 rounded-3xl p-0.5 flex items-center justify-center shadow-lg font-bold text-white text-lg">
            <img src={logo} alt="logo" />
          </div>
          {!isCollapsed && <span className="text-xl font-extrabold text-white tracking-wide drop-shadow">Admin</span>}
        </div>
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          className="h-9 w-9 p-0 hover:bg-blue-600/30 rounded-xl transition-all"
        >
          {!isCollapsed && <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="mt-4 space-y-2">
          {routes.map((route, index) => {
            const Icon = route.icon;
            return (
              <li key={index}>
                <Link
                  to={route.href}
                  className={cn(
                    "flex items-center mx-2 gap-4 px-2 py-2 rounded-sm text-base font-medium transition-all duration-200",
                    "hover:scale-[1.03] hover:shadow-lg",
                    location.pathname === route.href
                      ? "bg-gradient-to-br rounded-br-xl rounded-tl-xl from-sky-800/20 via-sky-600/30 to-sky-900/25 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800/70 hover:text-white",
                    isCollapsed && "justify-center px-2"
                  )}
                  style={{ minHeight: 44 }}
                >
                  <Icon className={cn("h-6 w-6", route.color, location.pathname === route.href ? "drop-shadow-lg" : "")} />
                  {!isCollapsed && <span className="truncate">{route.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-700/60 bg-gradient-to-r from-gray-900/60 to-gray-800/40">
        <div className="flex items-center gap-3">
          {/* Avatar with initials */}
          <div className="min-w-[40px] min-h-[40px] h-10 w-10 bg-gradient-to-br from-sky-800/20 via-sky-600/30 to-sky-900/25 rounded-xl border flex items-center justify-center font-semibold text-white text-lg shadow-md">
            {user?.userName ? user?.userName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "U"}
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-base font-semibold text-white">{user?.userName || "User"}</p>
              <p className="text-xs text-gray-400">{user?.userEmail || "user@example.com"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
