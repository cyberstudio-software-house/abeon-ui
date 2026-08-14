import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AuthLayout } from "../../src/components/layout/auth-layout";
import { ForgotPasswordForm } from "../../src/components/layout/forgot-password-form";
import type { ForgotPasswordFormProps } from "../../src/components/layout/forgot-password-form";
import { Link } from "../../src/components/typography";

const renderPage = (args: ForgotPasswordFormProps, error?: ReactNode) => (
  <AuthLayout
    brand="Abeon"
    title="Przypomnij hasło"
    description="Podaj adres, którym logujesz się do Abeona."
    error={error}
    footer={<Link href="/login">Wróć do logowania</Link>}
  >
    <ForgotPasswordForm {...args} />
  </AuthLayout>
);

const meta: Meta<typeof ForgotPasswordForm> = {
  title: "Layout/ForgotPasswordPage",
  component: ForgotPasswordForm,
  parameters: { layout: "fullscreen" },
  render: (args) => renderPage(args),
};
export default meta;
type Story = StoryObj<typeof ForgotPasswordForm>;

export const Default: Story = {
  args: {
    action: "/password/forgot",
    backToLoginHref: "/login",
    hiddenFields: <input type="hidden" name="redirect" value="/crm/contacts" />,
  },
};

/**
 * The state after a successful POST. The copy is identical whether or not the
 * address belongs to an account — `abeon-auth-spec.md` FR-3 requires the reset
 * flow to be enumeration-safe, and this screen is where that leaks if it leaks.
 */
export const Sent: Story = {
  args: { ...Default.args, autoFocus: false, sent: true },
  render: (args) => (
    <AuthLayout brand="Abeon" title="Przypomnij hasło">
      <ForgotPasswordForm {...args} />
    </AuthLayout>
  ),
};

/** Only shape validation surfaces per-field — never "no such account". */
export const WithFieldError: Story = {
  args: {
    ...Default.args,
    autoFocus: false,
    emailDefaultValue: "anna.kowalska",
    emailError: "Podaj poprawny adres e-mail.",
  },
};

/** Rate limiting is the one failure that belongs at form level. */
export const WithError: Story = {
  args: { ...Default.args, autoFocus: false },
  render: (args) => renderPage(args, "Zbyt wiele prób. Spróbuj ponownie za kilka minut."),
};

export const Loading: Story = {
  args: { ...Default.args, autoFocus: false, loading: true },
};
