import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[#5E5ADB] text-white hover:bg-[#4F50C4] shadow-[0_2px_4px_rgba(94,90,219,0.4)] active:shadow-[0_1px_2px_rgba(94,90,219,0.2)]",
        secondary:
          "bg-white text-[#464F60] border border-[#E5E7EB] hover:bg-[#F9FAFB] shadow-[0_2px_4px_rgba(70,79,96,0.16),0_1px_2px_rgba(0,0,0,0.06)] active:shadow-[0_1px_2px_rgba(70,79,96,0.08)]",
        destructive:
          "bg-[#D1293D] text-white hover:bg-[#B8203A] shadow-[0_2px_4px_rgba(209,41,61,0.4)] active:shadow-[0_1px_2px_rgba(209,41,61,0.2)]",
        ghost: "hover:bg-[#F3F4F6] text-[#464F60]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
