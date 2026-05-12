import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MoreHorizontal, Cloud, Github, Keyboard, LifeBuoy, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../src/components/dropdown-menu";
import { Button } from "../../src/components/button";
import { IconButton } from "../../src/components/icon-button";

const meta: Meta<typeof DropdownMenu> = {
  title: "Primitives/DropdownMenu",
  component: DropdownMenu,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Otwórz menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="h-4 w-4" />
            Profil
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4" />
            Ustawienia
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard className="h-4 w-4" />
            Skróty
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-danger">
          <LogOut className="h-4 w-4" />
          Wyloguj
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const RowActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label="Akcje wiersza">
          <MoreHorizontal className="h-4 w-4" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Otwórz</DropdownMenuItem>
        <DropdownMenuItem>Edytuj</DropdownMenuItem>
        <DropdownMenuItem>Duplikuj</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-danger">Usuń</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => {
    const [columns, setColumns] = React.useState({ name: true, status: true, owner: false });
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Widoczne kolumny</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Pokaż / ukryj</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={columns.name}
            onCheckedChange={(v) => setColumns((c) => ({ ...c, name: !!v }))}
          >
            Nazwa
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columns.status}
            onCheckedChange={(v) => setColumns((c) => ({ ...c, status: !!v }))}
          >
            Status
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columns.owner}
            onCheckedChange={(v) => setColumns((c) => ({ ...c, owner: !!v }))}
          >
            Właściciel
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithRadioItems: Story = {
  render: () => {
    const [density, setDensity] = React.useState("comfortable");
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Gęstość: {density}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Gęstość tabeli</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
            <DropdownMenuRadioItem value="compact">Kompaktowa</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comfortable">Wygodna</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="spacious">Przestronna</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Pomoc</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <LifeBuoy className="h-4 w-4" />
          Centrum pomocy
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Cloud className="h-4 w-4" />
            Status systemu
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>API</DropdownMenuItem>
            <DropdownMenuItem>Webhooks</DropdownMenuItem>
            <DropdownMenuItem>Mailboxy</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github className="h-4 w-4" />
          GitHub
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
