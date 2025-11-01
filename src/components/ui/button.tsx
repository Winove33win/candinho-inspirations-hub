import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--focus)] focus-visible:[outline-offset:1px] focus-visible:[box-shadow:0_0_0_4px_color-mix(in_srgb,var(--brand)_20%,transparent)] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-[var(--brand-active)] bg-[var(--brand)] text-white shadow-[var(--shadow-1)] hover:bg-[var(--brand-hover)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] active:bg-[var(--brand-active)]",
        secondary:
          "border-[var(--divider)] bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--surface-2)]",
        outline:
          "border-[var(--divider)] bg-transparent text-[var(--text-2)] hover:bg-[var(--surface)]",
        ghost:
          "border-[var(--divider)] bg-transparent text-[var(--text-2)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]",
        link: "border border-transparent bg-transparent text-[var(--brand)] underline-offset-4 hover:underline",
        destructive:
          "border-[var(--danger)] bg-[var(--danger)] text-white hover:bg-[color-mix(in_srgb,var(--danger)_88%,black_12%)]",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-4 py-2 text-sm",
        lg: "px-7 py-3 text-base",
        icon: "h-11 w-11 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
