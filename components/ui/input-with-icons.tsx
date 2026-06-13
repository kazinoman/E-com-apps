import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

type InputFieldProps = React.ComponentProps<"input"> & {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
};

export function InputField({ label, icon, error, className, ...props }: InputFieldProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-semibold text-gray-700 block ml-1">{label}</label>}

      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}

        <Input className={cn(icon ? "pl-10" : "", className)} {...props} />
      </div>

      {error && <p className="text-xs text-white  bg-danger/90 p-2 rounded">{error}</p>}
    </div>
  );
}
