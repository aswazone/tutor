import { toast } from "sonner";

    export const toastAuthCheck = () => {
        toast("Please login to unlock this course",{
            position: "top-right",
            className: "mt-10",
            action: {
                label: "Login",
                onClick: () => {
                    window.location.href = "/auth";
                }
            }
        });
    }