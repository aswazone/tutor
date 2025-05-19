import { RootState } from '@/store';
import { JSX } from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

type UnProtectedRoutesProps = { children: JSX.Element }

const UnProtectedRoutes = ({ children }: UnProtectedRoutesProps): JSX.Element => {

    const {user,isAuthenticated} = useSelector((state:RootState) => state.auth);

    if(isAuthenticated){
        if(user?.role === 'admin'){
            return <Navigate to="/admin" replace/>
        }
        return <Navigate to="/profile" replace/>;
    }

  return (
    <>{children}</>
  )
}

export default UnProtectedRoutes