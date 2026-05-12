import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Scissors, Maximize2, Pencil, Sparkles, Languages } from "lucide-react";
import {
  AIGenerateDialog,
  AITextToolbar,
  type AIOutlineItem,
  type AITextAction,
} from "../../src/components/ai-writing-tools";
import { Button } from "../../src/components/button";

// ─── AIGenerateDialog stories ────────────────────────

type DemoTone = "formal" | "casual" | "professional" | "creative" | "academic";
type DemoLength = "short" | "medium" | "long";

const tones: Record<DemoTone, string> = {
  formal: "Formalny",
  casual: "Luźny / potoczny",
  professional: "Profesjonalny",
  creative: "Kreatywny",
  academic: "Akademicki",
};

const lengths: Record<DemoLength, string> = {
  short: "Krótki (~500 słów)",
  medium: "Średni (~1000 słów)",
  long: "Długi (~2000 słów)",
};

const languages: Record<string, string> = {
  pl: "Polski",
  en: "English",
  de: "Deutsch",
};

async function fakeProposeOutline(): Promise<AIOutlineItem[]> {
  await new Promise((r) => setTimeout(r, 1200));
  return [
    { id: "1", heading: "Wprowadzenie", bullets: ["Kontekst", "Dlaczego to ważne", "Co czytelnik zyska"] },
    { id: "2", heading: "Kluczowe zagadnienia", bullets: ["Analiza obecnej sytuacji", "Trendy", "Dane i statystyki"] },
    { id: "3", heading: "Praktyczne zastosowania", bullets: ["Case study #1", "Najlepsze praktyki"] },
    { id: "4", heading: "Podsumowanie", bullets: ["Wnioski", "Następne kroki"] },
  ];
}

async function fakeGenerate(
  _input: unknown,
  onProgress?: (n: number) => void
): Promise<{ content: string }> {
  for (let p = 0; p <= 100; p += 10) {
    await new Promise((r) => setTimeout(r, 200));
    onProgress?.(p);
  }
  return { content: "<h2>Wygenerowany artykuł</h2><p>Lorem ipsum…</p>" };
}

function DialogDemo({ hasExistingContent = false }: { hasExistingContent?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [lastResult, setLastResult] = React.useState<string>("");

  return (
    <div className="space-y-3">
      <Button onClick={() => setOpen(true)}>Otwórz AI Generator</Button>
      {lastResult && (
        <pre className="text-xs bg-muted/40 p-3 rounded-md max-w-md whitespace-pre-wrap">
          {lastResult}
        </pre>
      )}
      <AIGenerateDialog<DemoTone, DemoLength>
        open={open}
        onOpenChange={setOpen}
        onProposeOutline={fakeProposeOutline}
        onGenerate={fakeGenerate}
        onComplete={(result) => setLastResult(result.content)}
        tones={tones}
        lengths={lengths}
        languages={languages}
        defaultTone="professional"
        defaultLength="medium"
        defaultLanguage="pl"
        hasExistingContent={hasExistingContent}
        promptSuggestions={[
          "Poradnik krok po kroku",
          "Analiza trendów",
          "Case study",
          "Lista najlepszych praktyk",
        ]}
        labels={{
          titlePrompt: "Generuj treść z AI",
          titleOutline: "Konspekt artykułu",
          titleGenerating: "Generowanie artykułu…",
          promptLabel: "Opisz o czym ma być artykuł",
          promptPlaceholder: "Np. Trendy w e-commerce na 2026 rok…",
          toneLabel: "Styl",
          lengthLabel: "Długość",
          languageLabel: "Język",
          cancel: "Anuluj",
          back: "Wróć",
          proposeOutline: "Generuj konspekt",
          proposingOutline: "Generuję konspekt…",
          generate: (n) => `Generuj artykuł (${n} sekcji)`,
          outlineHelp:
            "AI przygotowało konspekt. Możesz usunąć sekcje, które Ci nie odpowiadają.",
          generatingPhase1: "Analizuję konspekt i prompt…",
          generatingPhase2: "Generuję treść sekcji…",
          generatingPhase3: "Optymalizuję styl i spójność…",
          generatingPhase4: "Finalizuję artykuł…",
          overwriteWarning:
            "Istniejąca treść zostanie zastąpiona nową wygenerowaną przez AI.",
        }}
      />
    </div>
  );
}

const meta: Meta = {
  title: "Composite/AIWritingTools",
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

export const GenerateDialog: Story = {
  render: () => <DialogDemo />,
};

export const GenerateDialogWithExistingContent: Story = {
  render: () => <DialogDemo hasExistingContent />,
};

// ─── AITextToolbar stories ───────────────────────────

const actions: AITextAction[] = [
  { id: "shorten", label: "Skróć", icon: <Scissors className="h-3.5 w-3.5" /> },
  { id: "expand", label: "Rozwiń", icon: <Maximize2 className="h-3.5 w-3.5" /> },
  { id: "rewrite", label: "Przeredaguj", icon: <Pencil className="h-3.5 w-3.5" /> },
  { id: "improve", label: "Ulepsz styl", icon: <Sparkles className="h-3.5 w-3.5" /> },
  {
    id: "translate",
    label: "Przetłumacz",
    icon: <Languages className="h-3.5 w-3.5" />,
    submenu: [
      { id: "en", label: "Angielski" },
      { id: "de", label: "Niemiecki" },
      { id: "fr", label: "Francuski" },
      { id: "pl", label: "Polski" },
    ],
  },
];

function ToolbarDemo() {
  const [visible, setVisible] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [last, setLast] = React.useState<string>("");

  return (
    <div className="relative h-[300px] rounded-md border border-border bg-muted/30 p-6">
      <p className="text-sm text-foreground-muted mb-2">
        Symulowany floating toolbar (zwykle pozycjonowany przy zaznaczonym tekście).
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setVisible(!visible)}>
          {visible ? "Ukryj" : "Pokaż"} toolbar
        </Button>
      </div>
      {last && <pre className="mt-3 text-xs">Ostatnia akcja: {last}</pre>}
      <AITextToolbar
        visible={visible}
        position={{ top: 200, left: 80 }}
        actions={actions}
        isProcessing={processing}
        onAction={async (id, sub) => {
          setLast(sub ? `${id} → ${sub}` : id);
          setProcessing(true);
          await new Promise((r) => setTimeout(r, 1200));
          setProcessing(false);
        }}
        labels={{ processing: "AI przetwarza…" }}
      />
    </div>
  );
}

export const TextToolbar: Story = {
  render: () => <ToolbarDemo />,
};
