import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-blue-100 text-primary",
    success: "bg-green-100 text-success",
    warning: "bg-yellow-100 text-warning",
    error: "bg-red-100 text-error",
    secondary: "bg-slate-200 text-secondary"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = "Badge";

export default Badge;