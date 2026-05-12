import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Inbox, Send, Archive, Trash2, Star, FileText } from "lucide-react";
import {
  InboxLayout,
  type InboxPane,
} from "../../src/components/layout/inbox-layout";
import { ScrollArea } from "../../src/components/scroll-area";
import { cn } from "../../src/lib/utils";

const folders = [
  { id: "inbox", label: "Skrzynka odbiorcza", icon: Inbox, count: 12 },
  { id: "starred", label: "Oznaczone gwiazdką", icon: Star, count: 3 },
  { id: "sent", label: "Wysłane", icon: Send },
  { id: "drafts", label: "Wersje robocze", icon: FileText, count: 1 },
  { id: "archive", label: "Archiwum", icon: Archive },
  { id: "trash", label: "Kosz", icon: Trash2 },
];

const threads = [
  { id: "t1", from: "Anna K.", subject: "Migracja CRM — status", preview: "W tym tygodniu kończymy migrację bazy klientów…", time: "10:24" },
  { id: "t2", from: "Tomek W.", subject: "Re: Rebranding propozycje", preview: "Załączam trzy warianty logo, czekam na opinię…", time: "09:12" },
  { id: "t3", from: "Maria N.", subject: "Audyt — raport końcowy", preview: "Pełny raport w załączniku, rekomendacje na końcu…", time: "wczoraj" },
  { id: "t4", from: "Piotr M.", subject: "Aplikacja mobilna v2 — kickoff", preview: "Spotkanie startowe w środę o 10:00…", time: "wczoraj" },
  { id: "t5", from: "Helpdesk", subject: "Zgłoszenie #4521 zamknięte", preview: "Twoje zgłoszenie zostało rozwiązane…", time: "pn" },
];

function FoldersPane({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <ScrollArea className="h-full bg-sidebar text-sidebar-foreground">
      <div className="p-3">
        <h3 className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
          Skrzynka
        </h3>
        <ul className="mt-1 space-y-0.5">
          {folders.map((f) => {
            const Icon = f.icon;
            return (
              <li key={f.id}>
                <button
                  onClick={() => onSelect(f.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                    activeId === f.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-sidebar-accent"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {f.label}
                  </span>
                  {f.count !== undefined && (
                    <span className="text-xs opacity-70">{f.count}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </ScrollArea>
  );
}

function ThreadListPane({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollArea className="h-full bg-background">
      <ul className="divide-y divide-border">
        {threads.map((th) => (
          <li key={th.id}>
            <button
              onClick={() => onSelect(th.id)}
              className={cn(
                "block w-full px-4 py-3 text-left transition-colors hover:bg-accent/50",
                activeId === th.id && "bg-accent"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{th.from}</span>
                <span className="text-xs text-foreground-muted">{th.time}</span>
              </div>
              <p className="mt-1 truncate text-sm">{th.subject}</p>
              <p className="mt-1 truncate text-xs text-foreground-muted">{th.preview}</p>
            </button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

function PreviewPane({ threadId }: { threadId: string | null }) {
  const thread = threads.find((t) => t.id === threadId);
  if (!thread) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
        Wybierz wiadomość, aby ją podejrzeć.
      </div>
    );
  }
  return (
    <ScrollArea className="h-full bg-background">
      <div className="p-6">
        <h2 className="text-xl font-semibold">{thread.subject}</h2>
        <div className="mt-2 text-sm text-foreground-muted">
          Od: <span className="text-foreground">{thread.from}</span> · {thread.time}
        </div>
        <div className="mt-6 leading-relaxed">
          <p>{thread.preview}</p>
          <p className="mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p className="mt-4">Pozdrawiam,<br />{thread.from}</p>
        </div>
      </div>
    </ScrollArea>
  );
}

const meta: Meta<typeof InboxLayout> = {
  title: "Layout/InboxLayout",
  component: InboxLayout,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof InboxLayout>;

function FullDemo({
  forceTwoPane = false,
  hidePreview = false,
}: {
  forceTwoPane?: boolean;
  hidePreview?: boolean;
}) {
  const [activeFolder, setActiveFolder] = React.useState("inbox");
  const [activeThread, setActiveThread] = React.useState<string | null>("t1");
  const [mobileActive, setMobileActive] = React.useState<InboxPane>("list");
  return (
    <div className="h-screen w-screen">
      <InboxLayout
        folders={<FoldersPane activeId={activeFolder} onSelect={setActiveFolder} />}
        list={
          <ThreadListPane
            activeId={activeThread}
            onSelect={(id) => {
              setActiveThread(id);
              setMobileActive("preview");
            }}
          />
        }
        preview={<PreviewPane threadId={activeThread} />}
        mobileActivePane={mobileActive}
        onMobileActivePaneChange={setMobileActive}
        forceTwoPane={forceTwoPane}
        hidePreview={hidePreview}
        labels={{
          foldersTrigger: "Foldery",
          backToList: "Powrót",
          emptyPreview: "Wybierz wiadomość, aby ją podejrzeć.",
        }}
      />
    </div>
  );
}

export const ThreePane: Story = {
  render: () => <FullDemo />,
};

export const TwoPaneTablet: Story = {
  render: () => <FullDemo forceTwoPane />,
};

export const NoPreview: Story = {
  render: () => <FullDemo hidePreview />,
};

export const MobileViewport: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => <FullDemo />,
};
