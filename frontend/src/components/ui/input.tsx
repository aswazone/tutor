import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-sky-400/50 selection:bg-sky-900 selection:text-white",
        "flex h-9 w-full min-w-0 rounded-lg border border-sky-900/50 bg-white/5 px-4 py-2 text-base",
        "backdrop-blur-md backdrop-filter transition-all duration-200",
        "shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.12)]",
        "outline-none focus:border-sky-500/50 focus:bg-white/10 focus:shadow-[0_8px_30px_rgba(14,165,233,0.12)]",
        "dark:bg-sky-900/5 dark:text-white/90 dark:placeholder:text-sky-400/30",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:border-red-500/50 aria-invalid:focus:border-red-500/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
