import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const headingVariants = cva("font-semibold tracking-tight text-foreground", {
  variants: {
    size: {
      "3xl": "text-3xl",
      "2xl": "text-2xl",
      xl: "text-xl",
      lg: "text-lg",
      base: "text-base",
      sm: "text-sm",
    },
  },
});

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = NonNullable<VariantProps<typeof headingVariants>["size"]>;

const defaultSizeForLevel: Record<HeadingLevel, HeadingSize> = {
  1: "3xl",
  2: "2xl",
  3: "xl",
  4: "lg",
  5: "base",
  6: "sm",
};

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  level?: HeadingLevel;
  asChild?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, size, asChild, className, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : (`h${level}` as `h${HeadingLevel}`);
    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ size: size ?? defaultSizeForLevel[level] }), className)}
        {...props}
      />
    );
  },
);
Heading.displayName = "Heading";

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-base leading-normal",
      "body-sm": "text-sm leading-normal",
      caption: "text-xs leading-normal",
      label: "text-sm font-medium uppercase tracking-wider",
    },
    tone: {
      default: "text-foreground",
      secondary: "text-foreground-secondary",
      muted: "text-foreground-muted",
      placeholder: "text-foreground-placeholder",
      primary: "text-primary",
      danger: "text-danger",
      success: "text-success",
      warning: "text-warning",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: { variant: "body", tone: "default", weight: "regular" },
});

type TextElement = "p" | "span" | "div";

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: TextElement;
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as = "p", asChild, variant, tone, weight, className, ...props }, ref) => {
    const Comp = (asChild ? Slot : as) as React.ElementType;
    return React.createElement(Comp, {
      ref,
      className: cn(textVariants({ variant, tone, weight }), className),
      ...props,
    });
  },
);
Text.displayName = "Text";

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  block?: boolean;
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ block = false, className, children, ...props }, ref) => {
    if (block) {
      return (
        <pre
          ref={ref as React.Ref<HTMLPreElement>}
          className={cn(
            "font-mono text-sm rounded-md bg-muted text-foreground p-3 overflow-x-auto",
            className,
          )}
          {...props}
        >
          <code className="font-mono">{children}</code>
        </pre>
      );
    }
    return (
      <code
        ref={ref}
        className={cn(
          "font-mono text-[0.9em] rounded bg-muted text-foreground px-1.5 py-0.5",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
);
Code.displayName = "Code";

const linkVariants = cva("transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm", {
  variants: {
    variant: {
      default: "text-primary underline underline-offset-4 hover:text-primary-hover",
      subtle: "text-foreground underline underline-offset-4 decoration-foreground-muted hover:decoration-foreground",
      muted: "text-foreground-muted underline-offset-4 hover:text-foreground hover:underline",
      standalone: "text-primary hover:text-primary-hover",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ asChild, variant, className, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "a";
    return (
      <Comp ref={ref} className={cn(linkVariants({ variant }), className)} {...props} />
    );
  },
);
Link.displayName = "Link";

export { Heading, Text, Code, Link, headingVariants, textVariants, linkVariants };
