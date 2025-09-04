
import { GlobalIncomingCallModal } from "@/components/call/IncomingCallModal";
import { Navbar } from "@/components/landing/Navbar";
import { env } from "@/config/env.config";
import { CallProvider } from "@/contexts/CallContext";
import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "react-router-dom";

const AppLayout = () => {

  const user = useAuth().user;

  return (
    <div className="flex flex-col items-center min-h-screen">
    <Navbar />
    <div className="w-full ">
      <CallProvider serverUrl={env.API_URL} currentUserId={user?._id ?? ''}>
        <Outlet />
        <GlobalIncomingCallModal />
      </CallProvider>
    </div>
  </div>
  )
}

export default AppLayout;