import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, ShoppingCart, User } from "lucide-react";
import { logout } from "@/store/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/store";
import { toast } from "sonner";

export function NavMenu() {

    const {user, isAuthenticated} = useSelector((state:RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
  
    const handleLogout = () =>{
      localStorage.removeItem('accessToken');
      dispatch(logout());
      toast.success("See you !!", {
        position: "top-right",
        closeButton: true,
        className: "mt-10",
      });
    }
  
    return (
        
      <div className='flex items-center lg:flex-row gap-4'>
        {user?.role !== 'admin' && <Button variant='outline' size='icon'>
          <ShoppingCart className='h-6 w-6'/>
          <span className="sr-only">User cart</span>
        </Button>}
        {isAuthenticated && (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className=' bg-black hover:opacity-90 transition-all duration-200 cursor-pointer ring-[0.5px] ring-transparent dark:ring-gray-600'>
              <AvatarFallback className='bg-black text-white font-extrabold'>{user?.userName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-40 mt-4 p-2 bg-background dark:bg-background/90' align='end'>
            <DropdownMenuLabel className='px-2 py-1.5'>
              <span className='text-xs text-muted-foreground'>Logged in as</span>
              <p className='font-medium'>{(user?.userName as string).slice(0,1).toUpperCase() + user?.userName.slice(1)}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='my-1.5'/>
            {user?.role !== 'admin' && 
            <>
            <DropdownMenuItem className='px-2 py-1.5 cursor-pointer' onClick={()=> navigate('/Profile')}>
              <User className='mr-2 h-4 w-4'/>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className='my-1.5'/>
            </>
            }
            <DropdownMenuItem className='px-2 py-1.5 cursor-pointer hover:text-red-600 focus:text-red-600' onClick={handleLogout}>
              <LogOut className='mr-2 h-4 w-4'/>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>)}
      </div>
    )
  }
