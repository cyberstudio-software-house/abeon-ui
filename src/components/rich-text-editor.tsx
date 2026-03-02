import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Highlight } from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Minus, Undo2, Redo2,
  Table as TableIcon, Highlighter,
  ZoomIn, ZoomOut, ChevronDown, Eraser,
} from "lucide-react";
import { Toggle } from "./toggle";
import { Separator } from "./separator";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "../lib/utils";
import { useEffect, useState, useRef, useCallback } from "react";

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  minHeight?: string;
}

const FONTS = [
  { label: "Domyślny", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Palatino", value: "'Palatino Linotype', serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
];

// A4: 210mm × 297mm. At 96dpi, 1mm ≈ 3.78px. Content area with margins.
const A4_WIDTH_PX = 794; // ~210mm
const A4_HEIGHT_PX = 1123; // ~297mm
const A4_PADDING_PX = 72; // ~19mm margins
const A4_CONTENT_HEIGHT = A4_HEIGHT_PX - A4_PADDING_PX * 2; // usable content height

function ToolbarButton({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Toggle
      size="sm"
      pressed={isActive}
      onPressedChange={() => onClick()}
      aria-label={title}
      title={title}
      className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
    >
      {children}
    </Toggle>
  );
}

function FontDropdown({ editor }: { editor: Editor }) {
  const currentFont = editor.getAttributes("textStyle")?.fontFamily || "";
  const currentLabel = FONTS.find(f => f.value === currentFont)?.label || "Domyślny";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs min-w-[100px] justify-between bg-background border border-input">
          <span className="truncate">{currentLabel}</span>
          <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px] z-50 bg-popover">
        {FONTS.map(font => (
          <DropdownMenuItem
            key={font.label}
            onClick={() => {
              if (font.value) {
                editor.chain().focus().setFontFamily(font.value).run();
              } else {
                editor.chain().focus().unsetFontFamily().run();
              }
            }}
            className={cn(currentFont === font.value && "bg-accent")}
          >
            <span style={{ fontFamily: font.value || "inherit" }}>{font.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HeadingDropdown({ editor }: { editor: Editor }) {
  const getCurrentHeading = () => {
    for (let i = 1; i <= 4; i++) {
      if (editor.isActive("heading", { level: i })) return `H${i}`;
    }
    return "¶";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs font-semibold min-w-[52px] bg-background border border-input">
          {getCurrentHeading()}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px] z-50 bg-popover">
        <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()} className={cn(!editor.isActive("heading") && "bg-accent")}>
          <span className="text-sm">Paragraf</span>
        </DropdownMenuItem>
        {[1, 2, 3, 4].map(level => (
          <DropdownMenuItem key={level} onClick={() => editor.chain().focus().toggleHeading({ level: level as 1|2|3|4 }).run()} className={cn(editor.isActive("heading", { level }) && "bg-accent")}>
            <span className={cn(level === 1 && "text-lg font-bold", level === 2 && "text-base font-bold", level === 3 && "text-sm font-semibold", level === 4 && "text-xs font-semibold")}>
              Nagłówek {level}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ListDropdown({ editor }: { editor: Editor }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs font-semibold min-w-[44px] bg-background border border-input">
          ≡
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px] z-50 bg-popover">
        <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn(editor.isActive("bulletList") && "bg-accent")}>
          <List className="h-4 w-4 mr-2" />Lista punktowa
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()} className={cn(editor.isActive("orderedList") && "bg-accent")}>
          <ListOrdered className="h-4 w-4 mr-2" />Lista numerowana
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()} className={cn(editor.isActive("blockquote") && "bg-accent")}>
          <Quote className="h-4 w-4 mr-2" />Cytat
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4 mr-2" />Linia pozioma
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <TableIcon className="h-4 w-4 mr-2" />Tabela 3×3
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EditorToolbar({ editor, zoom, onZoomChange }: { editor: Editor; zoom: number; onZoomChange: (z: number) => void }) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-border bg-background px-3 py-1.5">
      {/* Zoom */}
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onZoomChange(Math.max(50, zoom - 10))}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="text-xs font-medium min-w-[40px] text-center tabular-nums">{zoom}%</span>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onZoomChange(Math.min(200, zoom + 10))}>
        <ZoomIn className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1.5 h-5" />

      <FontDropdown editor={editor} />
      <HeadingDropdown editor={editor} />
      <ListDropdown editor={editor} />

      <Separator orientation="vertical" className="mx-1.5 h-5" />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Pogrubienie (Ctrl+B)">
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Kursywa (Ctrl+I)">
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Przekreślenie">
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} title="Podkreślenie (Ctrl+U)">
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive("highlight")} title="Zaznaczenie">
        <Highlighter className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1.5 h-5" />

      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} title="Do lewej">
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} title="Wyśrodkuj">
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} title="Do prawej">
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} isActive={editor.isActive({ textAlign: "justify" })} title="Wyjustuj">
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1.5 h-5" />

      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Cofnij (Ctrl+Z)">
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Ponów (Ctrl+Y)">
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1.5 h-5" />

      <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Usuń formatowanie">
        <Eraser className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

/** Splits editor HTML content across multiple A4 pages visually */
function A4PageView({ editor, zoom }: { editor: Editor; zoom: number }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  const scale = zoom / 100;
  const pageWidth = Math.round(A4_WIDTH_PX * scale);
  const pagePadding = Math.round(A4_PADDING_PX * scale);
  const pageHeight = Math.round(A4_HEIGHT_PX * scale);

  const measurePages = useCallback(() => {
    if (!contentRef.current) return;
    const editorEl = contentRef.current.querySelector(".tiptap") as HTMLElement;
    if (!editorEl) return;
    const contentHeight = editorEl.scrollHeight;
    const usableHeight = A4_CONTENT_HEIGHT * scale;
    const pages = Math.max(1, Math.ceil(contentHeight / usableHeight));
    setPageCount(pages);
  }, [scale]);

  useEffect(() => {
    measurePages();
    // Re-measure on every editor update
    const handler = () => measurePages();
    editor.on("update", handler);
    // Also measure on resize
    const ro = new ResizeObserver(handler);
    if (contentRef.current) {
      const tiptap = contentRef.current.querySelector(".tiptap");
      if (tiptap) ro.observe(tiptap);
    }
    return () => {
      editor.off("update", handler);
      ro.disconnect();
    };
  }, [editor, measurePages]);

  return (
    <div className="flex flex-col items-center gap-6">
      {Array.from({ length: pageCount }, (_, i) => {
        const isFirst = i === 0;
        const usableHeight = A4_CONTENT_HEIGHT * scale;
        return (
          <div
            key={i}
            className="bg-background shadow-lg border border-border/50 relative overflow-hidden"
            style={{
              width: `${pageWidth}px`,
              minHeight: `${pageHeight}px`,
              maxHeight: `${pageHeight}px`,
            }}
          >
            {/* Page number */}
            <div className="absolute bottom-3 right-4 text-[10px] text-muted-foreground/50 select-none">
              {i + 1} / {pageCount}
            </div>
            <div
              ref={isFirst ? contentRef : undefined}
              style={{
                padding: `${pagePadding}px`,
                fontSize: `${zoom}%`,
                marginTop: isFirst ? 0 : `-${usableHeight * i}px`,
                height: `${usableHeight}px`,
                overflow: "hidden",
              }}
            >
              {isFirst ? (
                <EditorContent editor={editor} />
              ) : (
                /* Clone content shifted upward for subsequent pages */
                <div
                  style={{ marginTop: `-${usableHeight * i}px` }}
                  className="pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RichTextEditor({
  content = "",
  onChange,
  placeholder = "Zacznij pisać...",
  className,
  editable = true,
  minHeight = "300px",
}: RichTextEditorProps) {
  const [zoom, setZoom] = useState(100);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      TextStyle,
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Highlight,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert max-w-none focus:outline-none",
          "prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base",
          "prose-p:my-2 prose-li:my-0.5 prose-p:leading-relaxed",
          "prose-table:border-collapse prose-td:border prose-td:border-border prose-td:p-2 prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted/50",
          "prose-blockquote:border-l-2 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-hr:my-6"
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && !editable) {
      editor.setEditable(false);
    }
  }, [editor, editable]);

  if (!editor) return null;

  return (
    <div className={cn("flex flex-col rounded-lg border border-border overflow-hidden bg-muted/30", className)}>
      {editable && <EditorToolbar editor={editor} zoom={zoom} onZoomChange={setZoom} />}
      <div className="flex-1 overflow-y-auto py-8 px-4" style={{ minHeight }}>
        <A4PageView editor={editor} zoom={zoom} />
      </div>
    </div>
  );
}
