import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "../lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      leadingIcon,
      trailingIcon,
      onClear,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const hasValue =
      value !== undefined && value !== null && value !== ""
        ? true
        : defaultValue !== undefined && defaultValue !== null && defaultValue !== ""
          ? true
          : false;
    const showClear = !!onClear && hasValue;
    const showTrailing = !!trailingIcon && !showClear;
    const hasAddons = !!leadingIcon || showClear || showTrailing;

    const inputClasses = cn(
      "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      error && "border-destructive focus-visible:ring-destructive",
      leadingIcon && "pl-9",
      (showClear || showTrailing) && "pr-9",
      className,
    );

    if (!hasAddons) {
      return (
        <input
          type={type}
          ref={ref}
          className={inputClasses}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />
      );
    }

    return (
      <div className="relative">
        {leadingIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center text-muted-foreground pointer-events-none [&>svg]:h-4 [&>svg]:w-4">
            {leadingIcon}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          className={inputClasses}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear input"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent transition-colors"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
        {showTrailing && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center text-muted-foreground pointer-events-none [&>svg]:h-4 [&>svg]:w-4">
            {trailingIcon}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

interface SearchInputProps extends Omit<InputProps, "type" | "leadingIcon"> {
  onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => <Input type="search" leadingIcon={<Search />} ref={ref} {...props} />,
);
SearchInput.displayName = "SearchInput";

export { Input, SearchInput };
