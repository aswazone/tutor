
import { Navbar } from "@/components/landing/Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col items-center min-h-screen">
    <Navbar />
    <div className="w-full ">
      <Outlet />
    </div>
  </div>
  )
}

export default AppLayout;