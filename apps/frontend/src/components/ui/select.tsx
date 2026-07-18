import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-lg border border-line bg-white px-3.5 py-2.5 pr-9 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-accent-900/40",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 dark:text-slate-500" />
      </div>
    );
  }
);
