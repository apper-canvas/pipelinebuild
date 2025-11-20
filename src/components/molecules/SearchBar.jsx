import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  value,
  onChange 
}) => {
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        focused ? "shadow-card" : "shadow-lifted"
      )}>
        <ApperIcon 
          name="Search" 
          className="absolute left-3 w-5 h-5 text-secondary z-10" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-12 pl-10 pr-4 bg-white border border-slate-300 rounded-lg text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary transition-all duration-200"
        />
      </div>
    </form>
  );
};

export default SearchBar;