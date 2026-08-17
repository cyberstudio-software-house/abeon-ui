import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Text } from "../typography";

export interface SetPasswordFormLabels {
  password?: string;
  passwordConfirmation?: string;
  submit?: string;
  hint?: string;
  showPassword?: string;
  hidePassword?: string;
}

const defaultLabels: Required<SetPasswordFormLabels> = {
  password: "Hasło",
  passwordConfirmation: "Powtórz hasło",
  submit: "Ustaw hasło i zaloguj",
  hint: "Co najmniej 12 znaków. Bez wymogów co do znaków specjalnych — długość liczy się bardziej.",
  showPassword: "Pokaż hasło",
  hidePassword: "Ukryj hasło",
};

export interface SetPasswordFormProps {
  /** Native form target. Left unset the form posts to the current URL. */
  action?: string;
  method?: string;
  /** Optional — for Inertia/fetch submits. The form still works without it. */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /** Hidden inputs the host controls: CSRF token, invitation token. */
  hiddenFields?: React.ReactNode;
  passwordError?: string;
  loading?: boolean;
  /** Focus the first field on mount. Disable when several forms share a page. */
  autoFocus?: boolean;
  /**
   * Restated from the host's own rule so the browser can refuse before a round
   * trip. The server remains the authority — see the note in the component.
   */
  minLength?: number;
  labels?: SetPasswordFormLabels;
  className?: string;
}

/**
 * Presentational "choose a password" form — invitation acceptance today, the
 * second half of a password reset when that exists.
 *
 * Like `LoginForm`, a real `<form method action>` with named fields, so it
 * submits without JavaScript. Credentials never leave this component: the host
 * owns the POST, the CSRF token and the redirect.
 *
 * **The field names are fixed, not a default.** Laravel's `confirmed` rule
 * derives the second field's name from the first, so a host validating
 * `password => ['confirmed']` requires exactly `password` and
 * `password_confirmation`. Renaming them here silently turns every submission
 * into a validation failure the host cannot explain, so they are not props.
 *
 * `minLength` is a courtesy, not a control: it saves a round trip and nothing
 * else. The host's own rule decides, and a browser is not where a password
 * policy lives.
 */
export function SetPasswordForm({
  action,
  method = "post",
  onSubmit,
  hiddenFields,
  passwordError,
  loading = false,
  autoFocus = true,
  minLength = 12,
  labels,
  className,
}: SetPasswordFormProps) {
  const t = { ...defaultLabels, ...labels };
  const id = React.useId();
  const passwordId = `${id}-password`;
  const confirmationId = `${id}-password-confirmation`;
  const passwordErrorId = `${id}-password-error`;
  const hintId = `${id}-hint`;
  const [revealed, setRevealed] = React.useState(false);

  return (
    <form
      action={action}
      method={method}
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-4", className)}
    >
      {hiddenFields}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={passwordId}>{t.password}</Label>
        <div className="relative">
          <Input
            id={passwordId}
            name="password"
            type={revealed ? "text" : "password"}
            required
            minLength={minLength}
            autoFocus={autoFocus}
            autoComplete="new-password"
            error={!!passwordError}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? passwordErrorId : hintId}
            className="pr-9"
          />
          {/* Input's own trailingIcon is pointer-events-none, so the toggle is its own button. */}
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? t.hidePassword : t.showPassword}
            aria-pressed={revealed}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-foreground-muted transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={confirmationId}>{t.passwordConfirmation}</Label>
        {/*
          Deliberately not tied to the reveal toggle above. Confirming a password
          you can read is not confirming anything, and the whole point of the
          second field is that it is typed rather than copied.
        */}
        <Input
          id={confirmationId}
          name="password_confirmation"
          type="password"
          required
          minLength={minLength}
          autoComplete="new-password"
          error={!!passwordError}
          aria-invalid={!!passwordError}
          aria-describedby={passwordError ? passwordErrorId : undefined}
        />
        {passwordError && (
          <p id={passwordErrorId} className="text-sm text-danger">
            {passwordError}
          </p>
        )}
      </div>

      <Button type="submit" loading={loading} className="mt-1 w-full">
        {t.submit}
      </Button>

      {t.hint && (
        <Text id={hintId} variant="body-sm" tone="secondary">
          {t.hint}
        </Text>
      )}
    </form>
  );
}
