import * as React from "react";
import {
  Sparkles,
  Loader2,
  ChevronRight,
  ArrowLeft,
  ListOrdered,
  Wand2,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Badge } from "./badge";
import { Progress } from "./progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// ─── Types ───────────────────────────────────────────

export interface AIOutlineItem {
  id: string;
  heading: string;
  bullets: string[];
}

export interface AIGenerateInput<TTone extends string, TLength extends string> {
  prompt: string;
  tone: TTone;
  length: TLength;
  language: string;
  outline: AIOutlineItem[];
}

export interface AIGenerateResult {
  content: string;
  meta?: Record<string, unknown>;
}

// ─── AIGenerateDialog ────────────────────────────────

export interface AIGenerateDialogLabels {
  titlePrompt?: string;
  titleOutline?: string;
  titleGenerating?: string;
  promptLabel?: string;
  promptPlaceholder?: string;
  toneLabel?: string;
  lengthLabel?: string;
  languageLabel?: string;
  cancel?: string;
  back?: string;
  proposeOutline?: string;
  proposingOutline?: string;
  generate?: (sectionCount: number) => string;
  outlineHelp?: string;
  generatingPhase1?: string;
  generatingPhase2?: string;
  generatingPhase3?: string;
  generatingPhase4?: string;
  overwriteWarning?: string;
}

const defaultDialogLabels: Required<AIGenerateDialogLabels> = {
  titlePrompt: "Generate content with AI",
  titleOutline: "Article outline",
  titleGenerating: "Generating article…",
  promptLabel: "What should the article be about?",
  promptPlaceholder: "E.g. Trends in e-commerce in 2026…",
  toneLabel: "Tone",
  lengthLabel: "Length",
  languageLabel: "Language",
  cancel: "Cancel",
  back: "Back",
  proposeOutline: "Propose outline",
  proposingOutline: "Generating outline…",
  generate: (n) => `Generate article (${n} sections)`,
  outlineHelp: "Review the outline. Remove sections you don't want, then generate the full article.",
  generatingPhase1: "Analyzing outline and prompt…",
  generatingPhase2: "Generating section content…",
  generatingPhase3: "Optimizing style and consistency…",
  generatingPhase4: "Finalizing article…",
  overwriteWarning: "Existing content will be replaced with AI-generated content.",
};

export interface AIGenerateDialogProps<
  TTone extends string = string,
  TLength extends string = string
> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Async: ask consumer's LLM to propose an outline. */
  onProposeOutline: (input: {
    prompt: string;
    tone: TTone;
    length: TLength;
    language: string;
  }) => Promise<AIOutlineItem[]>;
  /** Async: ask consumer's LLM to generate the article. Receive progress via callback. */
  onGenerate: (
    input: AIGenerateInput<TTone, TLength>,
    onProgress?: (percent: number) => void
  ) => Promise<AIGenerateResult>;
  /** Called once generation completes successfully. Receives the generated content. */
  onComplete: (result: AIGenerateResult, input: AIGenerateInput<TTone, TLength>) => void;
  tones: Record<TTone, string>;
  lengths: Record<TLength, string>;
  languages: Record<string, string>;
  defaultTone: TTone;
  defaultLength: TLength;
  defaultLanguage: string;
  promptSuggestions?: string[];
  hasExistingContent?: boolean;
  labels?: AIGenerateDialogLabels;
}

export function AIGenerateDialog<
  TTone extends string,
  TLength extends string
>({
  open,
  onOpenChange,
  onProposeOutline,
  onGenerate,
  onComplete,
  tones,
  lengths,
  languages,
  defaultTone,
  defaultLength,
  defaultLanguage,
  promptSuggestions,
  hasExistingContent = false,
  labels,
}: AIGenerateDialogProps<TTone, TLength>) {
  const t = { ...defaultDialogLabels, ...labels };

  const [step, setStep] = React.useState<"prompt" | "outline" | "generating">(
    "prompt"
  );
  const [prompt, setPrompt] = React.useState("");
  const [tone, setTone] = React.useState<TTone>(defaultTone);
  const [length, setLength] = React.useState<TLength>(defaultLength);
  const [language, setLanguage] = React.useState(defaultLanguage);
  const [outline, setOutline] = React.useState<AIOutlineItem[]>([]);
  const [progress, setProgress] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const resetState = React.useCallback(() => {
    setStep("prompt");
    setPrompt("");
    setOutline([]);
    setProgress(0);
    setIsLoading(false);
    setTone(defaultTone);
    setLength(defaultLength);
    setLanguage(defaultLanguage);
  }, [defaultTone, defaultLength, defaultLanguage]);

  const handleClose = (val: boolean) => {
    if (!val) resetState();
    onOpenChange(val);
  };

  const handleProposeOutline = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const items = await onProposeOutline({ prompt, tone, length, language });
      setOutline(items);
      setStep("outline");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveOutlineItem = (id: string) => {
    setOutline((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGenerateContent = async () => {
    setStep("generating");
    setProgress(0);
    const input: AIGenerateInput<TTone, TLength> = {
      prompt,
      tone,
      length,
      language,
      outline,
    };
    try {
      const result = await onGenerate(input, setProgress);
      setProgress(100);
      onComplete(result, input);
      resetState();
      onOpenChange(false);
    } catch (err) {
      setStep("outline");
      setProgress(0);
      throw err;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {step === "prompt" && t.titlePrompt}
            {step === "outline" && t.titleOutline}
            {step === "generating" && t.titleGenerating}
          </DialogTitle>
        </DialogHeader>

        {step === "prompt" && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t.promptLabel}</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.promptPlaceholder}
                rows={3}
                className="resize-none"
              />
            </div>

            {promptSuggestions && promptSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {promptSuggestions.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent transition-colors text-xs"
                    onClick={() =>
                      setPrompt((prev) => (prev ? `${prev}. ${s}` : s))
                    }
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground-muted">{t.toneLabel}</Label>
                <Select
                  value={tone}
                  onValueChange={(v) => setTone(v as TTone)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tones).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground-muted">{t.lengthLabel}</Label>
                <Select
                  value={length}
                  onValueChange={(v) => setLength(v as TLength)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(lengths).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground-muted">{t.languageLabel}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languages).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasExistingContent && (
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
                <p className="text-xs text-warning">{t.overwriteWarning}</p>
              </div>
            )}
          </div>
        )}

        {step === "outline" && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-foreground-muted">{t.outlineHelp}</p>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {outline.map((item, i) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border p-3 group relative"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-mono text-foreground-muted mt-0.5 w-5 shrink-0">
                      {i + 1}.
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.heading}</p>
                      <ul className="mt-1 space-y-0.5">
                        {item.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="text-xs text-foreground-muted flex items-center gap-1.5"
                          >
                            <span className="h-1 w-1 rounded-full bg-foreground-muted/40 shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => handleRemoveOutlineItem(item.id)}
                      className="text-foreground-muted hover:text-danger text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove section"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={Math.min(progress, 100)} className="h-2" />
              <p className="text-xs text-center text-foreground-muted">
                {progress < 30 && t.generatingPhase1}
                {progress >= 30 && progress < 60 && t.generatingPhase2}
                {progress >= 60 && progress < 90 && t.generatingPhase3}
                {progress >= 90 && t.generatingPhase4}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === "prompt" && (
            <>
              <Button variant="outline" onClick={() => handleClose(false)}>
                {t.cancel}
              </Button>
              <Button
                onClick={handleProposeOutline}
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    {t.proposingOutline}
                  </>
                ) : (
                  <>
                    <ListOrdered className="h-4 w-4 mr-1.5" />
                    {t.proposeOutline}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </>
          )}
          {step === "outline" && (
            <>
              <Button variant="outline" onClick={() => setStep("prompt")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t.back}
              </Button>
              <Button
                onClick={handleGenerateContent}
                disabled={outline.length === 0}
              >
                <Wand2 className="h-4 w-4 mr-1.5" />
                {t.generate(outline.length)}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── AITextToolbar ───────────────────────────────────

export interface AITextAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** When provided, clicking the action opens a submenu of choices. */
  submenu?: { id: string; label: string }[];
}

export interface AITextToolbarLabels {
  processing?: string;
}

const defaultToolbarLabels: Required<AITextToolbarLabels> = {
  processing: "AI is processing…",
};

export interface AITextToolbarProps {
  visible: boolean;
  position: { top: number; left: number };
  actions: AITextAction[];
  onAction: (actionId: string, submenuId?: string) => void;
  isProcessing?: boolean;
  className?: string;
  labels?: AITextToolbarLabels;
}

export function AITextToolbar({
  visible,
  position,
  actions,
  onAction,
  isProcessing = false,
  className,
  labels,
}: AITextToolbarProps) {
  const t = { ...defaultToolbarLabels, ...labels };
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  if (!visible) return null;

  const submenuAction = openSubmenu
    ? actions.find((a) => a.id === openSubmenu)
    : null;

  return (
    <div
      className={cn(
        "fixed z-50 bg-popover border border-border shadow-lg rounded-xl p-1 flex items-center gap-0.5 animate-in fade-in slide-in-from-bottom-2",
        className
      )}
      style={{ top: position.top, left: position.left }}
      role="toolbar"
    >
      {isProcessing ? (
        <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {t.processing}
        </div>
      ) : submenuAction ? (
        <>
          <button
            onClick={() => setOpenSubmenu(null)}
            className="p-1.5 rounded-lg hover:bg-accent text-xs"
            aria-label="Back"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          {submenuAction.submenu?.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onAction(submenuAction.id, s.id);
                setOpenSubmenu(null);
              }}
              className="px-2.5 py-1.5 rounded-lg hover:bg-accent text-xs whitespace-nowrap"
            >
              {s.label}
            </button>
          ))}
        </>
      ) : (
        <>
          <div className="flex items-center px-1">
            <Sparkles className="h-3.5 w-3.5 text-primary mr-1" />
          </div>
          {actions.map((a) => (
            <button
              key={a.id}
              onClick={() =>
                a.submenu ? setOpenSubmenu(a.id) : onAction(a.id)
              }
              className="px-2.5 py-1.5 rounded-lg hover:bg-accent text-xs whitespace-nowrap flex items-center gap-1"
            >
              {a.icon}
              {a.label}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
