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
import { User } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store";
import { BorderBeam } from "../magicui/border-beam";

export function NavMenu() {

    const {user, isAuthenticated} = useSelector((state:RootState) => state.auth);
    const navigate = useNavigate();
  
    return (
        
      <div className='flex items-center lg:flex-row gap-4'>
        {isAuthenticated && location.pathname !== '/profile' && (
          <DropdownMenu>
          <DropdownMenuTrigger className="ml-3 md:ml-0" asChild>
            <Avatar className=' bg-black hover:opacity-90 transition-all duration-200 cursor-pointer ring-[0.5px] ring-transparent dark:ring-gray-600'>
              <AvatarFallback className='bg-black text-white font-extrabold'>{user?.userName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='' align='start'>
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
        {user?.role === 'student' ? 
        <Button className="relative" variant='ghost' onClick={() => navigate('/my-courses')}>
          My courses ✨
          <BorderBeam colorFrom="#00bcff" colorTo="#014f79" size={20} delay={0} duration={6}/>
          <BorderBeam colorFrom="#00bcff" colorTo="#014f79" size={20} delay={0} duration={6} initialOffset={450}/>
        </Button>
        :
          null
        }
      </div>
    )
  }
