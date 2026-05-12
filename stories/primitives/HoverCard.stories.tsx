import type { Meta, StoryObj } from "@storybook/react";
import { CalendarDays } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../src/components/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../../src/components/avatar";
import { Button } from "../../src/components/button";

const meta: Meta<typeof HoverCard> = {
  title: "Primitives/HoverCard",
  component: HoverCard,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof HoverCard>;

export const UserPreview: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">
          @anna.kowalska
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Anna Kowalska</h4>
            <p className="text-sm text-foreground-muted">
              Product Designer w zespole Platforma. Skupia się na systemie projektowym.
            </p>
            <div className="flex items-center pt-2 text-xs text-foreground-muted">
              <CalendarDays className="mr-2 h-3 w-3" />
              <span>Dołączyła w styczniu 2024</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const RichContent: Story = {
  render: () => (
    <p className="text-sm">
      Sprawdź dokumentację{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="h-auto p-0 align-baseline">
            modułu Cloud
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold">Moduł Cloud</h4>
            <p className="text-foreground-muted">
              Zarządzanie projektami chmurowymi, mailboxami i domenami.
            </p>
            <div className="flex gap-3 text-xs text-foreground-muted">
              <span>v2.4.1</span>
              <span>•</span>
              <span>Aktualizacja: 2026-04-15</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      , aby dowiedzieć się więcej.
    </p>
  ),
};
