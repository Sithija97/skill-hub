import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      label: "text-sm font-medium leading-none",
      "page-title":
        "font-['Inter'] not-italic text-base font-semibold tracking-tight text-[#1A1D26]",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "label";

const variantElementMap: Record<
  NonNullable<VariantProps<typeof typographyVariants>["variant"]>,
  TypographyElement
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  lead: "p",
  large: "p",
  small: "p",
  muted: "p",
  label: "label",
  "page-title": "span",
};

export interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: TypographyElement;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "p", as, children, ...props }, ref) => {
    const Tag = (as ?? variantElementMap[variant!]) as TypographyElement;

    return React.createElement(
      Tag,
      {
        ref,
        className: cn(typographyVariants({ variant }), className),
        ...props,
      },
      children,
    );
  },
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };
