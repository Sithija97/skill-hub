import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4 border-[3px]",
  md: "h-6 w-6 border-[3px]",
  lg: "h-10 w-10 border-[4px]",
};

export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-primary/25 border-t-primary",
        sizeClasses[size],
        className,
      )}
    />
  );
}
