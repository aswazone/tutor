import { useLocation } from "react-router-dom";



const ProtectedRoute = ({isAuthenticated, user, children}) => {

    const location = useLocation();
  return (
    {children}
  )
}

export default ProtectedRoute;