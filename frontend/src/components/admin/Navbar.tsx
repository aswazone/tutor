import { ModeToggle } from "@/components/landing/mode-toggle";
import { Button } from "@/components/ui/button";
import { AppDispatch } from "@/store";
import { logout } from "@/store/auth/authSlice";
import { Power } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export function AdminNavbar() {

  const [clickCount, setClickCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handlePowerClick = () => {
    setClickCount((prevCount:number) => prevCount + 1);
    if (clickCount + 1 === 3) {
      dispatch(logout());
      setClickCount(0);
      toast('Byee !!', { position: "top-right", closeButton: true, className: "mt-10" });
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-15 items-center justify-between">
        <div className="ml-4 flex md:hidden md:ml-4">
          <a className="mr-6 flex items-center space-x-2 font-bold" href="/">
            <span>Dashboard</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4 mr-3">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
            </Button>
            <ModeToggle />
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 bg-sky-500/10 border-1 rounded-full"
            onClick={handlePowerClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {showTooltip && (
              <div className="absolute top-17 transform -translate-x-1/2 bg-gray-800 dark:bg-sky-200/10 text-white text-xs rounded py-1 px-2">
                {`Click ${3 - clickCount} more times to logout`}
              </div>
            )}
            <Power/>
          </Button>
        </div>
      </div>
    </header>
  );
}
