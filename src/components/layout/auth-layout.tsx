import * as React from "react";
import { cn } from "../../lib/utils";
import { Card } from "../card";
import { Alert, AlertDescription } from "../alert";
import { Heading, Text } from "../typography";

export interface AuthLayoutProps {
  /** Wordmark slot, rendered above the title in the brand treatment. */
  brand?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Form-level failure. Renders in an Alert, which already carries role="alert". */
  error?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Centred card for pre-authentication screens — login, password reset,
 * invitation acceptance. The one layout that runs without a session, so it
 * assumes no organisation, no grants and no chrome (per ADR-0027).
 */
export function AuthLayout({
  brand,
  title,
  description,
  error,
  footer,
  children,
  className,
}: AuthLayoutProps) {
  return (
    <div className={cn("grid min-h-screen place-items-center bg-background p-6", className)}>
      <main className="w-full max-w-[400px]">
        <Card className="flex flex-col gap-6 p-6 sm:p-9">
          <div className="flex flex-col gap-2">
            {brand && (
              <div className="font-mono text-xs uppercase tracking-[0.16em] text-foreground-muted">
                {brand}
              </div>
            )}
            <Heading level={1} size="2xl">
              {title}
            </Heading>
            {description && (
              <Text variant="body-sm" tone="secondary">
                {description}
              </Text>
            )}
          </div>

          {error && (
            <Alert variant="danger">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {children}

          {footer && (
            <div className="text-sm text-foreground-muted [&_a]:whitespace-nowrap">{footer}</div>
          )}
        </Card>
      </main>
    </div>
  );
}
