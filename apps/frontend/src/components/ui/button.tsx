import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantMap = {
  primary:
    "bg-accent text-white shadow-sm hover:bg-accent-600 disabled:hover:bg-accent",
  secondary:
    "bg-accent-50 text-accent-700 hover:bg-accent-100 dark:bg-white/10 dark:text-accent-200 dark:hover:bg-white/15",
  outline:
    "border border-line bg-white text-ink hover:bg-mist dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/5",
  ghost:
    "text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
  destructive:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-700"
};

const sizeMap = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm"
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantMap;
  size?: keyof typeof sizeMap;
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variantMap[variant],
        sizeMap[size],
        className
      )}
      {...props}
    />
  );
}
