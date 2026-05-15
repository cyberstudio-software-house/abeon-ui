import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "../../src/components/layout/app-shell";

const meta: Meta<typeof AppShell> = {
  title: "Layout/AppShell — Public variant",
  component: AppShell,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof AppShell>;

/**
 * `variant="public"` (per D8 + ADR §3.4) — bare wrapper used by Next.js
 * apps rendering public pages (CMS marketing, blog). No sidebar, no topbar.
 * Theme tokens still apply.
 */
export const Public: Story = {
  args: {
    variant: "public",
    children: (
      <div className="mx-auto max-w-2xl px-4 py-16 text-foreground">
        <h1 className="text-3xl font-bold mb-4">Publiczna strona CMS</h1>
        <p className="text-foreground-muted">
          Brak chrome — sam content. Wariant `public` używany dla SSR
          stron marketingowych i blogów.
        </p>
      </div>
    ),
  },
};

export const PublicNoPadding: Story = {
  args: {
    variant: "public",
    noPadding: true,
    children: (
      <div className="bg-muted h-screen flex items-center justify-center text-foreground">
        Pełny ekran bez paddingu (np. landing page z hero).
      </div>
    ),
  },
};
