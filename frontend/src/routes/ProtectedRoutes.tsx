import { RootState } from "@/store"
import { JSX } from "react"
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"


type ProtectedRoutesProps = { children: JSX.Element }


const ProtectedRoutes = ({ children }: ProtectedRoutesProps): JSX.Element => {

  const {isAuthenticated, user} = useSelector((state:RootState) => state.auth);  

  const location = useLocation();
  if(!isAuthenticated && !(location.pathname.includes('/auth'))){
    return <Navigate to="/auth" />
  }

  if(isAuthenticated && (location.pathname.includes('/auth'))){
    if(user?.role === 'admin'){
        return <Navigate to='/admin/dashboard'/>
    }else if(user?.role === 'tutor'){
        return <Navigate to='/tutor/dashboard'/>
    }else if(user?.role === 'student'){
        return <Navigate to='/student/dashboard'/>
    }
  }

  return (
    <>
      {children}
    </>
  )
}

export default ProtectedRoutes