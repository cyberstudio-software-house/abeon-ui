import * as React from "react";

import { cn } from "../lib/utils";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface PageHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<"header">, "children" | "title"> {
  title: React.ReactNode;
  titleAs?: HeadingTag;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({ title, titleAs: TitleTag = "h1", description, actions, back, className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn("mb-6 flex flex-wrap items-start justify-between gap-4", className)}
      {...props}
    >
      <div className="min-w-0 flex-1 basis-80 space-y-1">
        {back != null && <div>{back}</div>}
        <TitleTag className="break-words text-balance text-2xl font-semibold text-foreground">{title}</TitleTag>
        {description != null && (
          <div className="text-sm text-foreground-muted">{description}</div>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  ),
);
PageHeader.displayName = "PageHeader";

export { PageHeader };
