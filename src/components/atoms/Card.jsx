import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, children, hoverable = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl shadow-card border border-slate-100 transition-all duration-200",
        hoverable && "hover:shadow-card-hover hover:scale-[1.02] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;