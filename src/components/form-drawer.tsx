import * as React from "react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Spinner } from "./spinner";

type FormDrawerSide = "right" | "left" | "top" | "bottom";
type FormDrawerSize = "sm" | "md" | "lg" | "xl";

const sizeClassesBySide: Record<FormDrawerSide, Record<FormDrawerSize, string>> = {
  right: {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
  },
  left: {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
  },
  top: {
    sm: "max-h-[40vh]",
    md: "max-h-[60vh]",
    lg: "max-h-[75vh]",
    xl: "max-h-[90vh]",
  },
  bottom: {
    sm: "max-h-[40vh]",
    md: "max-h-[60vh]",
    lg: "max-h-[75vh]",
    xl: "max-h-[90vh]",
  },
};

export interface FormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  side?: FormDrawerSide;
  size?: FormDrawerSize;
  onCancel?: () => void;
  onSubmit?: () => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  submitting?: boolean;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  closeOnSubmit?: boolean;
  children: React.ReactNode;
}

const FormDrawer = ({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  size = "md",
  onCancel,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  submitting: submittingProp,
  footer,
  className,
  bodyClassName,
  closeOnSubmit = true,
  children,
}: FormDrawerProps) => {
  const [internalSubmitting, setInternalSubmitting] = React.useState(false);
  const submitting = submittingProp ?? internalSubmitting;

  const handleCancel = () => {
    if (submitting) return;
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const handleSubmit = async () => {
    if (!onSubmit || submitting) return;
    const result = onSubmit();
    if (result instanceof Promise) {
      try {
        setInternalSubmitting(true);
        await result;
        if (closeOnSubmit) onOpenChange(false);
      } finally {
        setInternalSubmitting(false);
      }
    } else if (closeOnSubmit) {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          "flex flex-col gap-0 p-0",
          sizeClassesBySide[side][size],
          className,
        )}
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className={cn("flex-1 overflow-y-auto px-6 py-4", bodyClassName)}>
          {children}
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          {footer ?? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={submitting}
              >
                {cancelLabel}
              </Button>
              {onSubmit && (
                <Button type="button" onClick={handleSubmit} disabled={submitting}>
                  {submitting && <Spinner size="sm" tone="inherit" className="mr-2" />}
                  {submitLabel}
                </Button>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
FormDrawer.displayName = "FormDrawer";

export { FormDrawer };
