import { checkUserBlocked, logout } from "@/store/auth/authSlice";
import { toast } from "sonner";
import { AppDispatch } from "@/store";

export async function checkBlockedStatus(dispatch: AppDispatch) {
    try {
        const resultAction = await dispatch(checkUserBlocked());
        
        if (checkUserBlocked.rejected.match(resultAction)) {
            // Clear auth data
            localStorage.removeItem('accessToken');
            sessionStorage.clear();
            
            // Show error message and redirect only if error is 403 (blocked)
            if (typeof resultAction.payload === 'string' && resultAction.payload.includes('blocked')) {
                toast.error("Account is blocked !!",{
                    duration: 5000,
                    className: 'mt-20',
                    position: 'top-center',
                    closeButton: true,
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'red',
                    }
                });
                dispatch(logout());
                // Use replace instead of href to prevent back navigation
                window.location.replace('/home');
            }
            return false;
        }
        
        if (checkUserBlocked.fulfilled.match(resultAction)) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error checking blocked status:', error);
        return false;
    }
}
