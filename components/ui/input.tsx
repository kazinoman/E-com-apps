import * as React from "react";

import { cn } from "@/lib/utils";

type InputWithIconProps = React.ComponentProps<"input"> & {
  icon?: React.ReactNode;
};

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 px-2.5 text-base shadow-xs outline-none border border-[#D6D0CF] rounded-lg py-3 pl-10 pr-3 text-[14px] text-[#292525] placeholder:text-[#999494] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all bg-transparent",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        "dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
