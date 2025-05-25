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
import { ShoppingCart, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store";

export function NavMenu() {

    const {user, isAuthenticated} = useSelector((state:RootState) => state.auth);
    const navigate = useNavigate();
  
    return (
        
      <div className='flex items-center lg:flex-row gap-4'>
        {user?.role !== 'admin' && 
        <Button variant='outline' size='icon'>
          <ShoppingCart className='h-6 w-6'/>
          <span className="sr-only">User cart</span>
        </Button>}
        {isAuthenticated && (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className=' bg-black hover:opacity-90 transition-all duration-200 cursor-pointer ring-[0.5px] ring-transparent dark:ring-gray-600'>
              <AvatarFallback className='bg-black text-white font-extrabold'>{user?.userName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='fixed top-5 -left-14 w-40 p-2 bg-background dark:bg-background/90' align='start'>
            <DropdownMenuLabel className='px-2 py-1.5'>
              <span className='text-xs text-muted-foreground'>Logged in as</span>
              <p className='font-medium'>{(user?.userName as string).slice(0,1).toUpperCase() + user?.userName.slice(1)}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='my-1.5'/>
            {user?.role !== 'admin' &&     
              (<DropdownMenuItem className='px-2 py-1.5 cursor-pointer' onClick={()=> navigate('/Profile')}>
                <User className='mr-2 h-4 w-4'/>
                Profile
              </DropdownMenuItem>)
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      </div>
    )
  }
