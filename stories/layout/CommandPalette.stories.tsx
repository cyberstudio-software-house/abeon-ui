import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Users, FileText, Settings, Plus, BarChart3 } from "lucide-react";
import {
  CommandPalette,
  type PaletteCommand,
  useCommandPaletteShortcut,
} from "../../src/components/layout/command-palette";
import { Button } from "../../src/components/button";

const navCommands: PaletteCommand[] = [
  {
    id: "nav.dashboard",
    title: "Otwórz dashboard",
    group: "Nawigacja",
    icon: BarChart3,
    shortcut: "g d",
    run: () => console.log("dashboard"),
    score: 10,
  },
  {
    id: "nav.contacts",
    title: "Kontakty",
    group: "Nawigacja",
    icon: Users,
    keywords: ["clients", "people"],
    run: () => console.log("contacts"),
  },
  {
    id: "nav.pages",
    title: "Strony CMS",
    group: "Nawigacja",
    icon: FileText,
    run: () => console.log("pages"),
  },
  {
    id: "action.new-contact",
    title: "Dodaj kontakt",
    subtitle: "Nowy rekord CRM",
    group: "Akcje",
    icon: Plus,
    run: () => console.log("new contact"),
  },
  {
    id: "nav.settings",
    title: "Ustawienia",
    group: "Konto",
    icon: Settings,
    run: () => console.log("settings"),
  },
];

const meta: Meta<typeof CommandPalette> = {
  title: "Layout/CommandPalette",
  component: CommandPalette,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    useCommandPaletteShortcut(() => setOpen((p) => !p));

    return (
      <div className="space-y-4 text-foreground">
        <p className="text-sm">
          Press <kbd className="rounded border bg-muted px-1.5 py-0.5">Cmd</kbd>{" "}
          + <kbd className="rounded border bg-muted px-1.5 py-0.5">K</kbd> or
          click the button.
        </p>
        <Button onClick={() => setOpen(true)}>Otwórz paletę</Button>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          commands={navCommands}
        />
      </div>
    );
  },
};

export const WithAsyncProvider: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    useCommandPaletteShortcut(() => setOpen((p) => !p));

    const commands: PaletteCommand[] = [
      ...navCommands,
      {
        id: "crm.search",
        title: "Search CRM contacts",
        group: "Search",
        async provider(query) {
          if (query.trim().length < 2) return [];
          await new Promise((r) => setTimeout(r, 100));
          return [
            { id: `crm.contact.1`, title: `Match: ${query} 1`, group: "Search results", run: () => {} },
            { id: `crm.contact.2`, title: `Match: ${query} 2`, group: "Search results", run: () => {} },
          ];
        },
      },
    ];

    return (
      <div className="text-foreground">
        <Button onClick={() => setOpen(true)}>Otwórz paletę</Button>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          commands={commands}
          placeholder="Type 2+ chars to trigger provider..."
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={[]}
        empty="Brak zarejestrowanych poleceń"
      />
    );
  },
};
