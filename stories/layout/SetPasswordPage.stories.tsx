import type { Meta, StoryObj } from "@storybook/react";
import { AuthLayout } from "../../src/components/layout/auth-layout";
import { SetPasswordForm } from "../../src/components/layout/set-password-form";
import type { SetPasswordFormProps } from "../../src/components/layout/set-password-form";

const renderPage = (args: SetPasswordFormProps, description?: React.ReactNode) => (
  <AuthLayout brand="Abeon" title="Ustaw hasło" description={description}>
    <SetPasswordForm {...args} />
  </AuthLayout>
);

const meta: Meta<typeof SetPasswordForm> = {
  title: "Layout/SetPasswordPage",
  component: SetPasswordForm,
  parameters: { layout: "fullscreen" },
  render: (args) => renderPage(args),
};
export default meta;
type Story = StoryObj<typeof SetPasswordForm>;

/**
 * Invitation acceptance — the second screen a new user ever sees, right after
 * the link in the message that invited them.
 *
 * The field names are fixed rather than configurable: Laravel's `confirmed`
 * rule derives the second name from the first, so the host validating
 * `password => ['confirmed']` needs exactly `password` and
 * `password_confirmation`.
 */
export const Default: Story = {
  args: {
    action: "/invitation/abc123",
    hiddenFields: <input type="hidden" name="_token" value="csrf-token-goes-here" />,
  },
};

/**
 * With the context the host knows and this component does not: who was invited,
 * and to which organisation. An invitation with no organisation drops the whole
 * clause rather than rendering an empty one.
 */
export const WithInvitationContext: Story = {
  args: Default.args,
  render: (args) =>
    renderPage(
      args,
      <>
        Zaproszenie dla <strong>anna@acme.test</strong> do organizacji{" "}
        <strong>Acme Sp. z o.o.</strong>
      </>,
    ),
};

/**
 * A rejected password. The message sits under the confirmation field and both
 * inputs go into the error state, because the host cannot tell which of the two
 * the person got wrong — and guessing would be worse than saying so.
 */
export const Rejected: Story = {
  args: {
    ...Default.args,
    passwordError: "Hasło nie zostało przyjęte. Użyj co najmniej 12 znaków.",
  },
};

export const Submitting: Story = {
  args: { ...Default.args, loading: true },
};
