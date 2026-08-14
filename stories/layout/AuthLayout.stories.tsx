import type { Meta, StoryObj } from "@storybook/react";
import { AuthLayout } from "../../src/components/layout/auth-layout";
import { Button } from "../../src/components/button";
import { Input } from "../../src/components/input";
import { Label } from "../../src/components/label";
import { Link } from "../../src/components/typography";

const meta: Meta<typeof AuthLayout> = {
  title: "Layout/AuthLayout",
  component: AuthLayout,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof AuthLayout>;

/**
 * The bare shell. Everything below the title is a slot — `LoginForm` and
 * `ForgotPasswordForm` are the two ready-made fillings, but any pre-auth
 * screen (invitation, e-mail verification, MFA challenge) composes the same way.
 */
export const Default: Story = {
  args: {
    brand: "Abeon",
    title: "Ustaw hasło",
    description: "Zaproszenie wygasa po 72 godzinach.",
    children: (
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="demo-password">Nowe hasło</Label>
          <Input id="demo-password" type="password" minLength={12} />
        </div>
        <Button type="submit" className="mt-1 w-full">
          Zapisz
        </Button>
      </form>
    ),
    footer: <Link href="#">Wróć do logowania</Link>,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: "Zaproszenie wygasło. Poproś administratora o nowe.",
  },
};

/** No brand, no description, no footer — the minimum the layout accepts. */
export const Minimal: Story = {
  args: {
    title: "Weryfikacja adresu",
    children: (
      <Button type="button" className="w-full">
        Wyślij ponownie
      </Button>
    ),
  },
};
