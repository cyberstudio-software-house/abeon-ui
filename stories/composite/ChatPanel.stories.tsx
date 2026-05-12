import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Blocks } from "lucide-react";
import {
  ChatPanel,
  type ChatMessage,
} from "../../src/components/chat-panel";

const seed: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Cześć! Jestem Abeon AI. Opisz, co chcesz osiągnąć — zaproponuję strukturę.",
    timestamp: new Date().toISOString(),
  },
];

function FakeChat({
  initial = seed,
  withExtras = false,
}: {
  initial?: ChatMessage[];
  withExtras?: boolean;
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initial);
  const [busy, setBusy] = React.useState(false);

  const onSend = async (text: string) => {
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", content: text },
    ]);
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1200));
    setMessages((m) => [
      ...m,
      {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: `Odebrałem: "${text}". Przygotowuję odpowiedź…`,
        meta: withExtras ? { blocksGenerated: 3 } : undefined,
      },
    ]);
    setBusy(false);
  };

  return (
    <div className="h-[600px] w-[420px] border border-border rounded-lg overflow-hidden">
      <ChatPanel
        messages={messages}
        onSend={onSend}
        isGenerating={busy}
        suggestions={[
          "Stwórz landing page dla firmy IT",
          "Dodaj sekcję z cennikiem",
          "Dodaj formularz kontaktowy",
        ]}
        labels={{
          title: "Abeon AI",
          subtitle: "Opisz stronę, a ją wygeneruję",
          generating: "AI generuje stronę…",
          inputPlaceholder: "Opisz stronę lub zmianę…",
          sendButton: "Wyślij",
        }}
        renderAssistantExtras={
          withExtras
            ? (msg) =>
                msg.meta?.blocksGenerated ? (
                  <div className="flex items-center gap-1.5 mt-2 text-xs opacity-75">
                    <Blocks className="h-3 w-3" />
                    Wygenerowano {String(msg.meta.blocksGenerated)} bloków
                  </div>
                ) : null
            : undefined
        }
      />
    </div>
  );
}

const meta: Meta<typeof ChatPanel> = {
  title: "Composite/ChatPanel",
  component: ChatPanel,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof ChatPanel>;

export const EmptyWithSuggestions: Story = {
  render: () => <FakeChat />,
};

export const InConversation: Story = {
  render: () => (
    <FakeChat
      initial={[
        ...seed,
        { id: "u-1", role: "user", content: "Stwórz landing page dla firmy IT" },
        {
          id: "a-2",
          role: "assistant",
          content: "Przygotowuję strukturę: hero, cechy, cennik, kontakt.",
        },
      ]}
    />
  ),
};

export const WithAssistantExtras: Story = {
  render: () => <FakeChat withExtras />,
};

export const Generating: Story = {
  render: () => {
    return (
      <div className="h-[600px] w-[420px] border border-border rounded-lg overflow-hidden">
        <ChatPanel
          messages={[
            ...seed,
            { id: "u-1", role: "user", content: "Dodaj sekcję z cennikiem" },
          ]}
          onSend={() => undefined}
          isGenerating
          labels={{
            title: "Abeon AI",
            subtitle: "Opisz stronę, a ją wygeneruję",
            generating: "AI generuje cennik…",
            inputPlaceholder: "Opisz stronę lub zmianę…",
          }}
        />
      </div>
    );
  },
};
