import * as React from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";

export type ChatMessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: React.ReactNode;
  timestamp?: string;
  /** Free-form bag for app-specific extras (e.g. { blocksGenerated: 5 }). */
  meta?: Record<string, unknown>;
}

export interface ChatPanelLabels {
  title?: string;
  subtitle?: string;
  generating?: string;
  inputPlaceholder?: string;
  sendButton?: string;
}

const defaultLabels: Required<ChatPanelLabels> = {
  title: "AI Assistant",
  subtitle: "How can I help?",
  generating: "Generating…",
  inputPlaceholder: "Type a message…",
  sendButton: "Send",
};

export interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (text: string) => void | Promise<void>;
  isGenerating?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  /** Override message rendering entirely. */
  renderMessage?: (msg: ChatMessage) => React.ReactNode;
  /** Render extras inside an assistant bubble (e.g. "Generated 5 blocks"). */
  renderAssistantExtras?: (msg: ChatMessage) => React.ReactNode;
  /** Replace the header. Use null to hide. */
  header?: React.ReactNode | null;
  className?: string;
  labels?: ChatPanelLabels;
}

export function ChatPanel({
  messages,
  onSend,
  isGenerating = false,
  suggestions,
  onSuggestionClick,
  renderMessage,
  renderAssistantExtras,
  header,
  className,
  labels,
}: ChatPanelProps) {
  const t = { ...defaultLabels, ...labels };
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isGenerating]);

  const canSend = input.trim().length > 0 && !isGenerating;

  const handleSend = () => {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    void onSend(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (s: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(s);
    } else {
      setInput(s);
    }
  };

  const showSuggestions =
    suggestions && suggestions.length > 0 && messages.length <= 1;

  const renderedHeader =
    header === undefined ? (
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">{t.title}</p>
          <p className="text-[11px] text-foreground-muted">{t.subtitle}</p>
        </div>
      </div>
    ) : (
      header
    );

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-l border-border",
        className
      )}
    >
      {renderedHeader}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) =>
          renderMessage ? (
            <React.Fragment key={msg.id}>{renderMessage(msg)}</React.Fragment>
          ) : (
            <DefaultMessage
              key={msg.id}
              message={msg}
              renderAssistantExtras={renderAssistantExtras}
            />
          )
        )}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-foreground-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.generating}
            </div>
          </div>
        )}
      </div>

      {showSuggestions && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions!.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-foreground-muted"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t border-border">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.inputPlaceholder}
            rows={1}
            className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isGenerating}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!canSend}
            aria-label={t.sendButton}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DefaultMessage({
  message,
  renderAssistantExtras,
}: {
  message: ChatMessage;
  renderAssistantExtras?: (msg: ChatMessage) => React.ReactNode;
}) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-4 py-2.5 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <div>{message.content}</div>
        {!isUser && renderAssistantExtras?.(message)}
      </div>
    </div>
  );
}
