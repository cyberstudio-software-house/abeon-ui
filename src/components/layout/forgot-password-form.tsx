import * as React from "react";
import { MailCheck } from "lucide-react";
import { cn } from "../../lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../alert";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Link } from "../typography";

export interface ForgotPasswordFormLabels {
  email?: string;
  emailHint?: string;
  submit?: string;
  backToLogin?: string;
  sentTitle?: string;
  sentBody?: string;
}

const defaultLabels: Required<ForgotPasswordFormLabels> = {
  email: "Adres e-mail",
  emailHint: "Wyślemy link do ustawienia nowego hasła.",
  submit: "Wyślij link",
  backToLogin: "Wróć do logowania",
  sentTitle: "Sprawdź skrzynkę",
  // Deliberately says nothing about whether the account exists — abeon-auth-spec.md FR-3
  // requires the reset endpoint to be enumeration-safe, and the copy has to match.
  sentBody:
    "Jeśli konto o tym adresie istnieje, wysłaliśmy na nie link do ustawienia nowego hasła. Link jest ważny przez godzinę.",
};

export interface ForgotPasswordFormProps {
  /** Native form target. Left unset the form posts to the current URL. */
  action?: string;
  method?: string;
  /** Optional — for Inertia/fetch submits. The form still works without it. */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /** Hidden inputs the host controls: CSRF token, redirect target. */
  hiddenFields?: React.ReactNode;
  /** Repopulates the field after a failed round-trip (Laravel's old('email')). */
  emailDefaultValue?: string;
  emailError?: string;
  loading?: boolean;
  /** Swaps the form for the confirmation. Says nothing about whether the account exists. */
  sent?: boolean;
  backToLoginHref?: string;
  /** Focus the email field on mount. Disable when several forms share a page. */
  autoFocus?: boolean;
  labels?: ForgotPasswordFormLabels;
  className?: string;
}

/**
 * Presentational password-reminder form. Same shape as {@link LoginForm}: a real
 * `<form method action>` with named fields that submits without JavaScript.
 * Pass `sent` after a successful POST to show the enumeration-safe confirmation.
 */
export function ForgotPasswordForm({
  action,
  method = "post",
  onSubmit,
  hiddenFields,
  emailDefaultValue,
  emailError,
  loading = false,
  sent = false,
  backToLoginHref,
  autoFocus = true,
  labels,
  className,
}: ForgotPasswordFormProps) {
  const t = { ...defaultLabels, ...labels };
  const id = React.useId();
  const emailId = `${id}-email`;
  const emailErrorId = `${id}-email-error`;
  const emailHintId = `${id}-email-hint`;

  if (sent) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {/* Alert hardcodes role="alert"; a confirmation is polite, so status wins the spread. */}
        <Alert variant="success" role="status">
          <MailCheck className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>{t.sentTitle}</AlertTitle>
          <AlertDescription>{t.sentBody}</AlertDescription>
        </Alert>
        {backToLoginHref && (
          <Link href={backToLoginHref} variant="standalone" className="text-sm">
            {t.backToLogin}
          </Link>
        )}
      </div>
    );
  }

  return (
    <form
      action={action}
      method={method}
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-4", className)}
    >
      {hiddenFields}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={emailId}>{t.email}</Label>
        <Input
          id={emailId}
          name="email"
          type="email"
          defaultValue={emailDefaultValue}
          required
          autoFocus={autoFocus}
          autoComplete="username"
          inputMode="email"
          error={!!emailError}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? emailErrorId : emailHintId}
        />
        {emailError ? (
          <p id={emailErrorId} className="text-sm text-danger">
            {emailError}
          </p>
        ) : (
          <p id={emailHintId} className="text-sm text-foreground-muted">
            {t.emailHint}
          </p>
        )}
      </div>

      <Button type="submit" loading={loading} className="mt-1 w-full">
        {t.submit}
      </Button>
    </form>
  );
}
