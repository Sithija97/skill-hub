import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-neutral-300 bg-neutral-200 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200",
        outline: "border-border text-foreground",
        success:
          "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-900 dark:text-emerald-300",
        warning:
          "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-600 dark:bg-amber-900 dark:text-amber-300",
        info: "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-600 dark:bg-blue-900 dark:text-blue-300",
        purple:
          "border-violet-300 bg-violet-100 text-violet-800 dark:border-violet-600 dark:bg-violet-900 dark:text-violet-300",
        rose:
          "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-600 dark:bg-rose-900 dark:text-rose-300",
        orange:
          "border-orange-300 bg-orange-100 text-orange-800 dark:border-orange-600 dark:bg-orange-900 dark:text-orange-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
