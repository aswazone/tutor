import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { JSX, useEffect, useCallback, useRef } from "react";
import { AppDispatch, RootState } from "@/store";
import axiosInstance, { axiosErrorMessage } from "@/config/axios.config";
import { toast } from "sonner";

type CheckUserStatusProps = {
  children: JSX.Element;
};

export const CheckUserStatus = ({ children }: CheckUserStatusProps): JSX.Element => {
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const toastShown = useRef(false);

  const checkUserIsActive = useCallback(async () => {
    try {
      await axiosInstance.post('api/v1/auth/check-user-blocked', {}, { 
        withCredentials: true 
      });
      toastShown.current = false;
    } catch (err: unknown) {
      const message = axiosErrorMessage(err);
      console.error('User status check failed:', message);
      
      
      if (!toastShown.current && message.toLowerCase().includes("blocked")) {
        toast.error("Account is blocked by admin!", {
          position: 'top-center',
          closeButton: true,
          className: 'mt-20',
          id: 'blocked-account-toast',
          style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8C0000',
          }
        });
        dispatch({ type: 'auth/logout' });
        toastShown.current = true;
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user && localStorage.getItem('accessToken')) {
      checkUserIsActive();
    }
    
    return () => {
      toastShown.current = false;
    };
  }, [auth.isAuthenticated, auth.user, checkUserIsActive, location.pathname]);

  return children;
};