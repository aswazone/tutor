import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { buttonVariants } from "../ui/button";
import { Menu, Power } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";
import { NavMenu } from "./NavMenu";
import HoldToConfirmButton from "../common/HoldToSubmit";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { logout } from "@/store/auth/authSlice";
import { GridLineHorizontal } from "../common/GridLines";
import { useState } from "react";
import NotificationButton from "../common/NotificationButton";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#courses",
    label: "Courses",
  },
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];





export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {user, isAuthenticated} = useSelector((state:RootState) => state.auth);
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

    const handleNavigation = (href: string) => {
        setIsOpen(false);
        const pathname = location.pathname;
        if(href === '#courses' && pathname !== '/home'){ 
          window.location.href = "/courses";
        }
        if(href === '#profile' && pathname !== '/profile'){ 
          window.location.href = "/profile";
        }
    };
 
  return (
    <header className="sticky z-50 top-0 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <GridLineHorizontal className="bottom-0" offset="1px"/>
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-5 md:px-20 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex items-center">
            <a
              rel="noreferrer noopener"
              href="/home"
              className="ml-2 font-bold text-xl flex items-center"
            >
              <LogoIcon />
              Tutor
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <div className="hidden md:flex">
              <ModeToggle />
              <NavMenu />
            </div>
            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    Tutor
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-start gap-2 m-4">
                  <NavMenu />
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => {
                        setIsOpen(false);
                        handleNavigation(href);
                      }}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
            <NotificationButton/>
                  
                  <div className="flex">
                    <ModeToggle />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href} onClick={() => handleNavigation(route.href)}
                key={i}
                className={`text-[14px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="relative hidden md:flex gap-2">
            <NotificationButton/>
            <ModeToggle />
            <NavMenu />
            {isAuthenticated && user?.role !== 'admin' && <HoldToConfirmButton onConfirm={handleLogout}><Power className="text-red-500" size={18}/></HoldToConfirmButton>}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
