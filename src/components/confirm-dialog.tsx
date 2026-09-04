import * as React from "react";

import { cn } from "../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { buttonVariants } from "./button";
import { Spinner } from "./spinner";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  /**
   * Called when `onConfirm`'s promise rejects.
   *
   * Without it a rejection is logged and swallowed. It was previously neither: the
   * `await` threw out of the click handler as an unhandled rejection, and the dialog was
   * left open with its spinner still turning.
   */
  onError?: (error: unknown) => void;
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading: loadingProp,
  onConfirm,
  onCancel,
  onError,
}: ConfirmDialogProps) => {
  const [internalLoading, setInternalLoading] = React.useState(false);
  const loading = loadingProp ?? internalLoading;

  /**
   * Confirm, and keep the dialog open if the work fails.
   *
   * `onOpenChange(false)` used to sit inside the `try` alongside the `await`, so a
   * rejection skipped it — correct as far as it went — but nothing caught the rejection
   * either. It escaped the click handler as an unhandled promise rejection, leaving the
   * dialog open with no explanation and, depending on the host, an error in the console
   * that names neither the action nor the dialog.
   *
   * Staying open on failure is the deliberate part: the user asked for something
   * irreversible, it did not happen, and closing the dialog would say the opposite.
   */
  const handleConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const result = onConfirm();

    if (!(result instanceof Promise)) return;

    event.preventDefault();

    try {
      setInternalLoading(true);
      await result;
      onOpenChange(false);
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        // Never silent. A caller that handles its own errors passes `onError`; one that
        // forgot gets a console entry rather than a dialog that simply stops responding.
        console.error("ConfirmDialog: onConfirm rejected", error);
      }
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={onCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={handleConfirm}
            className={cn(
              variant === "destructive" &&
                buttonVariants({ variant: "destructive" }),
            )}
          >
            {loading && <Spinner size="sm" tone="inherit" className="mr-2" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
ConfirmDialog.displayName = "ConfirmDialog";

export { ConfirmDialog };
