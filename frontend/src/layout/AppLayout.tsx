import { Navbar } from "@/components/landing/Navbar";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const AppLayout = () => {

  const auth = useSelector((state:RootState) => state.auth);
  console.log(auth.isAuthenticated);
  return (
    <div className="flex flex-col items-center min-h-screen">
    <Navbar />
    <div className="w-full">
      <Outlet />
    </div>
  </div>
  )
}

export default AppLayout;