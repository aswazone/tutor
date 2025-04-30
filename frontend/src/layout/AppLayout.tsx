import { Link, Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link to={"/"} className="flex items-center justify-center"><span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-900 text-2xl">Tutor</span></Link>
    </header>
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Outlet />
    </div>
  </div>
  )
}

export default AppLayout;