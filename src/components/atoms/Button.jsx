import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lifted hover:shadow-card",
    secondary: "bg-white text-secondary border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-lifted hover:shadow-card",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white shadow-lifted hover:shadow-card",
    ghost: "text-secondary hover:bg-slate-100 hover:text-slate-900",
    success: "bg-gradient-to-r from-success to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lifted hover:shadow-card",
    warning: "bg-gradient-to-r from-warning to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lifted hover:shadow-card",
    error: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lifted hover:shadow-card"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed hover:scale-100",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;