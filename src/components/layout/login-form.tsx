import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Link } from "../typography";

export interface LoginFormLabels {
  email?: string;
  password?: string;
  submit?: string;
  forgotPassword?: string;
  rememberMe?: string;
  showPassword?: string;
  hidePassword?: string;
}

const defaultLabels: Required<LoginFormLabels> = {
  email: "Adres e-mail",
  password: "Hasło",
  submit: "Zaloguj",
  forgotPassword: "Nie pamiętam hasła",
  rememberMe: "Zapamiętaj mnie",
  showPassword: "Pokaż hasło",
  hidePassword: "Ukryj hasło",
};

export interface LoginFormProps {
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
  passwordError?: string;
  loading?: boolean;
  showRememberMe?: boolean;
  forgotPasswordHref?: string;
  /** Focus the email field on mount. Disable when several forms share a page. */
  autoFocus?: boolean;
  labels?: LoginFormLabels;
  className?: string;
}

/**
 * Presentational login form. A real `<form method action>` with named fields,
 * so it submits without JavaScript and its markup maps one-to-one onto the
 * Blade screens in `abeon-auth-ui`. Credentials never leave this component —
 * the host owns the POST, the CSRF token and the redirect.
 */
export function LoginForm({
  action,
  method = "post",
  onSubmit,
  hiddenFields,
  emailDefaultValue,
  emailError,
  passwordError,
  loading = false,
  showRememberMe = false,
  forgotPasswordHref,
  autoFocus = true,
  labels,
  className,
}: LoginFormProps) {
  const t = { ...defaultLabels, ...labels };
  const id = React.useId();
  const emailId = `${id}-email`;
  const passwordId = `${id}-password`;
  const emailErrorId = `${id}-email-error`;
  const passwordErrorId = `${id}-password-error`;
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
          aria-describedby={emailError ? emailErrorId : undefined}
        />
        {emailError && (
          <p id={emailErrorId} className="text-sm text-danger">
            {emailError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <Label htmlFor={passwordId}>{t.password}</Label>
          {forgotPasswordHref && (
            <Link href={forgotPasswordHref} variant="muted" className="text-sm">
              {t.forgotPassword}
            </Link>
          )}
        </div>
        <div className="relative">
          <Input
            id={passwordId}
            name="password"
            type={revealed ? "text" : "password"}
            required
            autoComplete="current-password"
            error={!!passwordError}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? passwordErrorId : undefined}
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
        {passwordError && (
          <p id={passwordErrorId} className="text-sm text-danger">
            {passwordError}
          </p>
        )}
      </div>

      {showRememberMe && (
        <div className="flex items-center gap-2">
          {/* Native checkbox, not the Radix one: it has to submit in a no-JS POST. */}
          <input
            id={`${id}-remember`}
            name="remember"
            type="checkbox"
            value="1"
            // color-scheme is scoped to the control: tokens.css does not declare it, and the
            // unchecked native box would otherwise stay white on the dark theme.
            className="h-4 w-4 shrink-0 rounded-sm accent-primary [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:[color-scheme:dark]"
          />
          <Label htmlFor={`${id}-remember`} className="text-foreground-secondary">
            {t.rememberMe}
          </Label>
        </div>
      )}

      <Button type="submit" loading={loading} className="mt-1 w-full">
        {t.submit}
      </Button>
    </form>
  );
}
