import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Loader from "@/components/ui/loader";

interface CustomAlertProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  variant?: "default" | "success" | "error" | "warning";
  className?: string;
  onClose?: () => void;
}

const CustomAlert = ({
  title,
  description,
  isLoading = false,
  variant = "default",
  className,
  onClose,
}: CustomAlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const variantStyles = {
    default: "bg-background border",
    success: "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    error: "bg-destructive/15 border-destructive text-destructive dark:bg-destructive/20",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <Alert 
      className={cn(
        "flex items-center gap-2 relative",
        variantStyles[variant],
        className
      )}
    >
      
      <div className="flex-1">
        <AlertTitle className="font-semibold">
          {title}
        </AlertTitle>
        {description && (
          <AlertDescription className="mt-0.5 text-xs text-sky-200/40">
            {description}
          </AlertDescription>
        )}
      </div>

      {isLoading ? (
        <Loader 
          size="md"
          variant={variant === "default" ? "default" : variant}
          className="ml-1"
        />
      ) : (
        !isLoading && (
          <button
            onClick={handleClose}
            className="absolute right-2 top-2 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )
      )}
    </Alert>
  );
};

export default CustomAlert;