import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[12px] border border-[var(--elev-border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text-1)] placeholder:text-[color-mix(in_srgb,var(--text-3)_70%,transparent)] transition-all duration-200 focus-visible:border-[var(--brand)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--focus)] focus-visible:[outline-offset:1px] focus-visible:[box-shadow:0_0_0_4px_color-mix(in_srgb,var(--brand)_22%,transparent)] disabled:cursor-not-allowed disabled:opacity-60 md:text-base",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
