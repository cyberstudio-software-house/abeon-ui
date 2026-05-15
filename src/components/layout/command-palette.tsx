import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../command";

export interface PaletteCommand {
  /** Stable id, used as React key + dedup hint. */
  id: string;
  title: string;
  subtitle?: string | null;
  group?: string;
  icon?: React.ComponentType<{ className?: string }> | string | null;
  keywords?: readonly string[];
  /** Display-only keyboard hint, e.g. `"g c"`. */
  shortcut?: string | null;
  /** Optional ranking hint; higher = closer to top. */
  score?: number | null;
  /** Action invoked on selection. */
  run?: () => void | Promise<void>;
  /**
   * Async provider — return commands matching the user's query. Invoked on
   * keystroke change (debounced by 250ms).
   */
  provider?: (query: string) => Promise<PaletteCommand[]>;
}

export interface CommandPaletteProps {
  /** Controls dialog visibility. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Static commands rendered before provider results. */
  commands: PaletteCommand[];
  /** Empty-state text. */
  empty?: string;
  /** Input placeholder. */
  placeholder?: string;
  /** Optional pre-filtering — e.g. when palette is opened in a specific app context. */
  defaultQuery?: string;
}

const DEBOUNCE_MS = 250;

/**
 * Cmd+K palette (per ADR-0007). Renders `<CommandDialog>` (cmdk under the
 * hood) and surfaces a list of `PaletteCommand`s, optionally including
 * async provider entries that hit the network per keystroke.
 *
 * Use the standalone control when you have your own command source. For
 * federated chrome that aggregates per-service registries, use
 * `<ConnectedCommandPalette>` which feeds itself from `useCommandRegistry()`
 * in `@abeon/shared`.
 *
 * Cmd+K / Ctrl+K binding is wired by the consumer — set `open` from a
 * `useEffect` listening on `keydown`. The palette itself does not register
 * a global shortcut to avoid double-handling in nested mounts.
 */
export function CommandPalette({
  open,
  onOpenChange,
  commands,
  empty = "Brak wyników",
  placeholder = "Wpisz polecenie lub szukaj...",
  defaultQuery = "",
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState<string>(defaultQuery);
  const [providerResults, setProviderResults] = React.useState<PaletteCommand[]>([]);
  const providerVersion = React.useRef(0);

  React.useEffect(() => {
    if (!open) {
      setQuery(defaultQuery);
      setProviderResults([]);
    }
  }, [open, defaultQuery]);

  const providers = React.useMemo(
    () => commands.filter((c) => typeof c.provider === "function"),
    [commands],
  );
  const staticCommands = React.useMemo(
    () => commands.filter((c) => typeof c.provider !== "function" && typeof c.run === "function"),
    [commands],
  );

  React.useEffect(() => {
    if (!open || providers.length === 0 || query.trim() === "") {
      setProviderResults([]);
      return;
    }
    const version = ++providerVersion.current;
    const timeout = setTimeout(async () => {
      try {
        const results = await Promise.all(
          providers.map(async (p) => {
            try {
              return (await p.provider!(query)) ?? [];
            } catch {
              return [];
            }
          }),
        );
        // Drop stale results (a newer query started while we awaited).
        if (version !== providerVersion.current) return;
        setProviderResults(results.flat());
      } catch {
        setProviderResults([]);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [open, query, providers]);

  const groups = React.useMemo(
    () => groupCommands([...staticCommands, ...providerResults]),
    [staticCommands, providerResults],
  );

  const runCommand = (command: PaletteCommand) => {
    onOpenChange(false);
    void command.run?.();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={placeholder}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{empty}</CommandEmpty>
        {groups.map((group, idx) => (
          <React.Fragment key={group.label ?? `_g${idx}`}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={group.label ?? undefined}>
              {group.commands.map((cmd) => {
                const Icon = typeof cmd.icon === "function" ? cmd.icon : null;
                return (
                  <CommandItem
                    key={cmd.id}
                    value={`${cmd.title} ${(cmd.keywords ?? []).join(" ")}`}
                    onSelect={() => runCommand(cmd)}
                  >
                    {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                    <span className="flex-1 truncate">{cmd.title}</span>
                    {cmd.subtitle && (
                      <span className="ml-2 text-xs text-muted-foreground truncate">
                        {cmd.subtitle}
                      </span>
                    )}
                    {cmd.shortcut && <CommandShortcut>{cmd.shortcut}</CommandShortcut>}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

interface PaletteGroup {
  label: string | null;
  commands: PaletteCommand[];
}

function groupCommands(commands: PaletteCommand[]): PaletteGroup[] {
  const map = new Map<string, PaletteCommand[]>();
  const order: string[] = [];
  for (const cmd of commands) {
    const key = cmd.group ?? "";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(cmd);
  }
  return order.map((key) => ({
    label: key === "" ? null : key,
    commands: sortByScore(map.get(key)!),
  }));
}

function sortByScore(commands: PaletteCommand[]): PaletteCommand[] {
  return [...commands].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

/**
 * Hook for wiring Cmd+K / Ctrl+K to a command palette open state.
 *
 *     const [open, setOpen] = useState(false);
 *     useCommandPaletteShortcut(() => setOpen((prev) => !prev));
 */
export function useCommandPaletteShortcut(toggle: () => void): void {
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);
}
