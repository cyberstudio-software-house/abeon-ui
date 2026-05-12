import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../../src/components/context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "Primitives/ContextMenu",
  component: ContextMenu,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof ContextMenu>;

const TriggerArea = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-40 w-80 items-center justify-center rounded-md border border-dashed text-sm text-foreground-muted">
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TriggerArea>Kliknij prawym przyciskiem myszy</TriggerArea>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem inset>
          Cofnij
          <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Powtórz
          <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Wytnij</ContextMenuItem>
        <ContextMenuItem inset>Kopiuj</ContextMenuItem>
        <ContextMenuItem inset>Wklej</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const Rich: Story = {
  render: () => {
    const [showBookmarks, setShowBookmarks] = React.useState(true);
    const [showFullURLs, setShowFullURLs] = React.useState(false);
    const [tab, setTab] = React.useState("recent");
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <TriggerArea>Prawy klik — menu z checkboxami i radiogrupą</TriggerArea>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel inset>Widok</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={showBookmarks} onCheckedChange={setShowBookmarks}>
            Pokaż zakładki
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={showFullURLs} onCheckedChange={setShowFullURLs}>
            Pokaż pełne URL-e
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel inset>Sortowanie</ContextMenuLabel>
          <ContextMenuRadioGroup value={tab} onValueChange={setTab}>
            <ContextMenuRadioItem value="recent">Ostatnio używane</ContextMenuRadioItem>
            <ContextMenuRadioItem value="alpha">Alfabetycznie</ContextMenuRadioItem>
            <ContextMenuRadioItem value="created">Data utworzenia</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>Więcej</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Eksportuj…</ContextMenuItem>
              <ContextMenuItem>Drukuj…</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};
