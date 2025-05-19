import { AdminNavbar } from "@/components/admin/Navbar";
import { Sidebar } from "@/components/admin/Sidebar";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  console.log(auth.isAuthenticated);

  return (
    <div className="flex relative min-h-screen mesh-bg">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <AdminNavbar />
        <main className="p-4 fixed top-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;