import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover border border-border",
        ghost:
          "text-foreground-muted hover:bg-accent hover:text-foreground",
        outline:
          "border border-border bg-transparent text-foreground-secondary hover:bg-accent",
        danger:
          "text-danger hover:bg-danger-muted",
      },
      size: {
        sm: "h-7 w-7 [&_svg]:size-3.5",
        default: "h-8 w-8 [&_svg]:size-4",
        lg: "h-9 w-9 [&_svg]:size-[18px]",
        xl: "h-10 w-10 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  tooltip?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      tooltip,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    
    const button = (
      <Comp
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" /> : children}
      </Comp>
    );

    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  }
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
