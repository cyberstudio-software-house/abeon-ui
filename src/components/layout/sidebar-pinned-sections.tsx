import * as React from "react";
import { Pin, Pencil, Trash2, Check, X, Plus } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "../../lib/utils";
import { revealOnHover } from "../../lib/reveal-on-hover";
import { Input } from "../input";
import { getIconByName } from "../icon-picker";
import {
  CollapsedPinnedItem,
  SortablePinnedItem,
  type PinnedItem,
  type RenderPinnedLink,
  type ResolvePinnedIcon,
} from "./pinned-item-row";
import type { PinnedSection } from "./sidebar-pinned-section";

/** Pin ids per section id, each list in display order. */
export type PinnedLayout = Record<string, string[]>;

export interface PinnedArrangement {
  id: string;
  sectionId: string;
  order: number;
}

const SECTION_DROP_PREFIX = "section:";

/** Group the pins into their sections, each sorted by `order`. Pins of an unknown section go to the first one. */
export function layoutOf(sections: readonly PinnedSection[], items: readonly PinnedItem[]): PinnedLayout {
  const layout: PinnedLayout = Object.fromEntries(sections.map((s) => [s.id, [] as string[]]));
  const fallback = sections[0]?.id;
  [...items]
    .sort((a, b) => a.order - b.order)
    .forEach((item) => {
      const target = layout[item.sectionId] ? item.sectionId : fallback;
      if (target !== undefined) {
        layout[target]!.push(item.id);
      }
    });
  return layout;
}

function sectionOf(layout: PinnedLayout, id: string): string | undefined {
  if (id.startsWith(SECTION_DROP_PREFIX)) {
    return id.slice(SECTION_DROP_PREFIX.length);
  }
  return Object.keys(layout).find((sectionId) => layout[sectionId]!.includes(id));
}

/**
 * Where a dragged pin lands. `overId` is either another pin — the dragged one takes its
 * place — or a section's drop area, which puts it at the end of that section, and is the
 * only way into a section that is still empty.
 */
export function moveItem(layout: PinnedLayout, activeId: string, overId: string): PinnedLayout {
  const from = sectionOf(layout, activeId);
  const to = sectionOf(layout, overId);
  if (from === undefined || to === undefined) {
    return layout;
  }

  if (from === to) {
    const list = layout[from]!;
    const oldIndex = list.indexOf(activeId);
    const newIndex = overId.startsWith(SECTION_DROP_PREFIX) ? list.length - 1 : list.indexOf(overId);
    if (oldIndex === newIndex || newIndex < 0) {
      return layout;
    }
    return { ...layout, [from]: arrayMove(list, oldIndex, newIndex) };
  }

  const source = layout[from]!.filter((id) => id !== activeId);
  const target = [...layout[to]!];
  const overIndex = target.indexOf(overId);
  target.splice(overIndex < 0 ? target.length : overIndex, 0, activeId);

  return { ...layout, [from]: source, [to]: target };
}

/** The layout as the list a host stores: every pin with its section and its position in it. */
export function arrangementOf(sections: readonly PinnedSection[], layout: PinnedLayout): PinnedArrangement[] {
  return sections.flatMap((section) =>
    (layout[section.id] ?? []).map((id, order) => ({ id, sectionId: section.id, order }))
  );
}

export interface SidebarPinnedSectionsLabels {
  unpin?: string;
  dragHandle?: string;
  renameSection?: string;
  removeSection?: string;
  save?: string;
  cancel?: string;
  addSection?: string;
  newSectionPlaceholder?: string;
  emptySectionHint?: string;
  dragInstructions?: string;
}

const defaultLabels: Required<SidebarPinnedSectionsLabels> = {
  unpin: "Unpin",
  dragHandle: "Drag to reorder",
  renameSection: "Rename section",
  removeSection: "Remove section",
  save: "Save",
  cancel: "Cancel",
  addSection: "Add section",
  newSectionPlaceholder: "Section name",
  emptySectionHint: "Drag a pin here",
  dragInstructions:
    "To pick up a pin, press space or enter. Use the arrow keys to move it, including into another section. Press space or enter again to drop it, or escape to cancel.",
};

export interface SidebarPinnedSectionsProps {
  /** In display order; the first one cannot be removed. */
  sections: PinnedSection[];
  items: PinnedItem[];
  collapsed?: boolean;
  /** Every pin with its section and position after a drag. */
  onArrange: (arrangement: PinnedArrangement[]) => void;
  onUnpin: (itemId: string) => void;
  onAddSection?: (label: string) => void;
  onRenameSection?: (sectionId: string, label: string) => void;
  onRemoveSection?: (sectionId: string) => void;
  renderLink?: RenderPinnedLink;
  resolveIcon?: ResolvePinnedIcon;
  className?: string;
  labels?: SidebarPinnedSectionsLabels;
}

/**
 * The pinned part of the sidebar: named sections, pins that can be dragged within and
 * between them, and a way to add a section. An empty section stays on screen with a drop
 * hint — in the MVP every new section was invisible, because empty sections were hidden
 * and no pin could ever be moved into one.
 */
export function SidebarPinnedSections({
  sections,
  items,
  collapsed = false,
  onArrange,
  onUnpin,
  onAddSection,
  onRenameSection,
  onRemoveSection,
  renderLink,
  resolveIcon = getIconByName as ResolvePinnedIcon,
  className,
  labels,
}: SidebarPinnedSectionsProps) {
  const t = { ...defaultLabels, ...labels };
  const byId = React.useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const stored = React.useMemo(() => layoutOf(sections, items), [sections, items]);
  const [dragLayout, setDragLayout] = React.useState<PinnedLayout | null>(null);
  const layout = dragLayout ?? stored;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (collapsed) {
    const ordered = sections.flatMap((section) => layout[section.id] ?? []);
    if (ordered.length === 0) {
      return null;
    }
    return (
      <div className={cn("mb-2 flex flex-col items-center space-y-0.5", className)}>
        {ordered.map((id) => {
          const item = byId.get(id);
          return item ? (
            <CollapsedPinnedItem key={id} item={item} renderLink={renderLink} resolveIcon={resolveIcon} />
          ) : null;
        })}
      </div>
    );
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const current = dragLayout ?? stored;
    if (sectionOf(current, String(active.id)) === sectionOf(current, String(over.id))) return;
    setDragLayout(moveItem(current, String(active.id), String(over.id)));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const current = dragLayout ?? stored;
    setDragLayout(null);
    if (!over) return;
    const next = moveItem(current, String(active.id), String(over.id));
    if (JSON.stringify(next) !== JSON.stringify(stored)) {
      onArrange(arrangementOf(sections, next));
    }
  };

  return (
    <div className={cn("mb-2 space-y-1", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setDragLayout(null)}
        accessibility={{ screenReaderInstructions: { draggable: t.dragInstructions } }}
      >
        {sections.map((section, index) => (
          <PinnedSectionBlock
            key={section.id}
            section={section}
            ids={layout[section.id] ?? []}
            byId={byId}
            removable={index > 0}
            labels={t}
            onUnpin={onUnpin}
            onRenameSection={onRenameSection}
            onRemoveSection={onRemoveSection}
            renderLink={renderLink}
            resolveIcon={resolveIcon}
          />
        ))}
      </DndContext>
      {onAddSection && <AddSection labels={t} onAdd={onAddSection} />}
    </div>
  );
}

interface PinnedSectionBlockProps {
  section: PinnedSection;
  ids: string[];
  byId: Map<string, PinnedItem>;
  removable: boolean;
  labels: Required<SidebarPinnedSectionsLabels>;
  onUnpin: (itemId: string) => void;
  onRenameSection?: (sectionId: string, label: string) => void;
  onRemoveSection?: (sectionId: string) => void;
  renderLink?: RenderPinnedLink;
  resolveIcon: ResolvePinnedIcon;
}

function PinnedSectionBlock({
  section,
  ids,
  byId,
  removable,
  labels: t,
  onUnpin,
  onRenameSection,
  onRemoveSection,
  renderLink,
  resolveIcon,
}: PinnedSectionBlockProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `${SECTION_DROP_PREFIX}${section.id}` });
  const [editing, setEditing] = React.useState(false);

  return (
    <section aria-label={section.label}>
      <div className="group flex items-center gap-1 px-2 py-1.5">
        {editing && onRenameSection ? (
          <InlineName
            initial={section.label}
            label={t.renameSection}
            saveLabel={t.save}
            cancelLabel={t.cancel}
            onSave={(label) => {
              onRenameSection(section.id, label);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <h3 className="flex min-w-0 items-center gap-1.5 px-1 text-xs font-medium uppercase tracking-wider text-foreground-muted">
              <Pin className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">{section.label}</span>
            </h3>
            <div className="flex-1" />
            {onRenameSection && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className={cn("p-0.5 hover:bg-sidebar-accent rounded", revealOnHover)}
                title={t.renameSection}
                aria-label={`${t.renameSection}: ${section.label}`}
              >
                <Pencil className="h-3 w-3 text-foreground-muted" aria-hidden />
              </button>
            )}
            {onRemoveSection && removable && (
              <button
                type="button"
                onClick={() => onRemoveSection(section.id)}
                className={cn("p-0.5 hover:bg-sidebar-accent rounded", revealOnHover)}
                title={t.removeSection}
                aria-label={`${t.removeSection}: ${section.label}`}
              >
                <Trash2 className="h-3 w-3 text-foreground-muted" aria-hidden />
              </button>
            )}
          </>
        )}
      </div>

      <SortableContext id={section.id} items={ids} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn("space-y-0.5 rounded-lg", ids.length === 0 && "min-h-10", isOver && "bg-sidebar-accent/50")}
        >
          {ids.map((id) => {
            const item = byId.get(id);
            return item ? (
              <SortablePinnedItem
                key={id}
                item={item}
                onUnpin={() => onUnpin(id)}
                renderLink={renderLink}
                resolveIcon={resolveIcon}
                unpinLabel={t.unpin}
                dragHandleLabel={t.dragHandle}
              />
            ) : null;
          })}
          {ids.length === 0 && (
            <p className="mx-3 rounded-lg border border-dashed border-sidebar-border px-3 py-2 text-xs text-foreground-muted">
              {t.emptySectionHint}
            </p>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

interface InlineNameProps {
  initial: string;
  label: string;
  placeholder?: string;
  saveLabel: string;
  cancelLabel: string;
  onSave: (label: string) => void;
  onCancel: () => void;
}

function InlineName({ initial, label, placeholder, saveLabel, cancelLabel, onSave, onCancel }: InlineNameProps) {
  const [value, setValue] = React.useState(initial);
  const save = () => {
    if (value.trim() !== "") {
      onSave(value.trim());
    }
  };

  return (
    <div className="flex flex-1 items-center gap-1">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-7 px-2 text-xs"
        aria-label={label}
        placeholder={placeholder}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            save();
          }
          if (e.key === "Escape") onCancel();
        }}
      />
      <button
        type="button"
        onClick={save}
        disabled={value.trim() === ""}
        className="rounded p-0.5 hover:bg-sidebar-accent disabled:opacity-40"
        aria-label={saveLabel}
      >
        <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
      </button>
      <button type="button" onClick={onCancel} className="rounded p-0.5 hover:bg-sidebar-accent" aria-label={cancelLabel}>
        <X className="h-3.5 w-3.5 text-foreground-muted" aria-hidden />
      </button>
    </div>
  );
}

function AddSection({ labels: t, onAdd }: { labels: Required<SidebarPinnedSectionsLabels>; onAdd: (label: string) => void }) {
  const [adding, setAdding] = React.useState(false);

  if (adding) {
    return (
      <div className="px-2 py-1">
        <InlineName
          initial=""
          label={t.addSection}
          placeholder={t.newSectionPlaceholder}
          saveLabel={t.save}
          cancelLabel={t.cancel}
          onSave={(label) => {
            onAdd(label);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setAdding(true)}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
    >
      <Plus className="h-4 w-4" aria-hidden />
      {t.addSection}
    </button>
  );
}
