import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AuthLayout } from "../../src/components/layout/auth-layout";
import { LoginForm } from "../../src/components/layout/login-form";
import type { LoginFormProps } from "../../src/components/layout/login-form";
import { Link } from "../../src/components/typography";

const renderPage = (args: LoginFormProps, error?: ReactNode) => (
  <AuthLayout
    brand="Abeon"
    title="Zaloguj się"
    error={error}
    footer={
      <>
        Nie masz konta? <Link href="#">Skontaktuj się z administratorem</Link>
      </>
    }
  >
    <LoginForm {...args} />
  </AuthLayout>
);

const meta: Meta<typeof LoginForm> = {
  title: "Layout/LoginPage",
  component: LoginForm,
  parameters: { layout: "fullscreen" },
  render: (args) => renderPage(args),
};
export default meta;
type Story = StoryObj<typeof LoginForm>;

/**
 * The platform's front door. `hiddenFields` is where the host drops its CSRF
 * token and the validated `redirect` target — this component never touches
 * either, it only leaves room for them.
 */
export const Default: Story = {
  args: {
    action: "/login",
    forgotPasswordHref: "/password/forgot",
    showRememberMe: true,
    hiddenFields: <input type="hidden" name="redirect" value="/crm/contacts" />,
  },
};

/** Form-level failure: wrong credentials. Never says which field was wrong. */
export const WithError: Story = {
  args: { ...Default.args, autoFocus: false, emailDefaultValue: "anna.kowalska@example.com" },
  render: (args) => renderPage(args, "Nieprawidłowy e-mail lub hasło."),
};

/** Per-field failures, for hosts that validate before calling Auth. */
export const WithFieldErrors: Story = {
  args: {
    ...Default.args,
    autoFocus: false,
    emailDefaultValue: "anna.kowalska",
    emailError: "Podaj poprawny adres e-mail.",
    passwordError: "Hasło jest wymagane.",
  },
};

export const Loading: Story = {
  args: { ...Default.args, autoFocus: false, loading: true },
};

/** `labels` overrides every string, so the same form ships in any locale. */
export const EnglishLabels: Story = {
  args: {
    ...Default.args,
    autoFocus: false,
    labels: {
      email: "E-mail address",
      password: "Password",
      submit: "Sign in",
      forgotPassword: "Forgot password?",
      rememberMe: "Remember me",
      showPassword: "Show password",
      hidePassword: "Hide password",
    },
  },
};
