import * as React from "react";
import { Pin, Pencil, Trash2, Check, X } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
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

export type { PinnedItem } from "./pinned-item-row";

export interface PinnedSection {
  id: string;
  label: string;
  order: number;
}

export interface SidebarPinnedSectionLabels {
  unpinTitle?: string;
  editSectionTitle?: string;
  removeSectionTitle?: string;
  saveLabel?: string;
  cancelLabel?: string;
  dragHandle?: string;
}

const defaultLabels: Required<SidebarPinnedSectionLabels> = {
  unpinTitle: "Unpin",
  editSectionTitle: "Rename section",
  removeSectionTitle: "Remove section",
  saveLabel: "Save",
  cancelLabel: "Cancel",
  dragHandle: "Drag to reorder",
};

export interface SidebarPinnedSectionProps {
  section: PinnedSection;
  items: PinnedItem[];
  collapsed?: boolean;
  /** Called with the new order after a drag-and-drop reorder. */
  onReorder: (items: PinnedItem[]) => void;
  /** Called when an item is unpinned via the per-item action. */
  onUnpin: (itemId: string) => void;
  /** When provided, the section label becomes editable in place. */
  onRenameSection?: (label: string) => void;
  /** When provided, a remove button appears next to the section header. */
  onRemoveSection?: () => void;
  /** Render a custom link wrapper. Default: a plain `<a href>`. */
  renderLink?: RenderPinnedLink;
  /** Override icon resolution. Default: looks up via IconPicker registry. */
  resolveIcon?: ResolvePinnedIcon;
  className?: string;
  labels?: SidebarPinnedSectionLabels;
}

/**
 * One section of pins. For several sections, with pins moving between them, use
 * `SidebarPinnedSections`.
 */
export function SidebarPinnedSection({
  section,
  items,
  collapsed = false,
  onReorder,
  onUnpin,
  onRenameSection,
  onRemoveSection,
  renderLink,
  resolveIcon = getIconByName as ResolvePinnedIcon,
  className,
  labels,
}: SidebarPinnedSectionProps) {
  const t = { ...defaultLabels, ...labels };
  const [isEditing, setIsEditing] = React.useState(false);
  const [editLabel, setEditLabel] = React.useState(section.label);

  React.useEffect(() => {
    setEditLabel(section.label);
  }, [section.label]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const next = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }));
      onReorder(next);
    }
  };

  const handleSaveLabel = () => {
    if (editLabel.trim() === "") {
      return;
    }
    onRenameSection?.(editLabel.trim());
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditLabel(section.label);
    setIsEditing(false);
  };

  if (items.length === 0) {
    return null;
  }

  if (collapsed) {
    return (
      <div className={cn("mb-2 flex flex-col items-center space-y-0.5", className)}>
        {items.map((item) => (
          <CollapsedPinnedItem key={item.id} item={item} renderLink={renderLink} resolveIcon={resolveIcon} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("mb-2", className)}>
      <div className="group flex items-center gap-1 px-2 py-1.5">
        {isEditing ? (
          <div className="flex items-center gap-1 flex-1">
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="h-6 text-xs px-2"
              aria-label={t.editSectionTitle}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveLabel();
                if (e.key === "Escape") handleCancelEdit();
              }}
            />
            <button type="button" onClick={handleSaveLabel} className="p-0.5 hover:bg-sidebar-accent rounded" aria-label={t.saveLabel}>
              <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
            </button>
            <button type="button" onClick={handleCancelEdit} className="p-0.5 hover:bg-sidebar-accent rounded" aria-label={t.cancelLabel}>
              <X className="h-3.5 w-3.5 text-foreground-muted" aria-hidden />
            </button>
          </div>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-wider text-foreground-muted flex items-center gap-1.5 px-1">
              <Pin className="h-3 w-3" aria-hidden />
              {section.label}
            </span>
            <div className="flex-1" />
            {onRenameSection && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={cn("p-0.5 hover:bg-sidebar-accent rounded", revealOnHover)}
                title={t.editSectionTitle}
                aria-label={`${t.editSectionTitle}: ${section.label}`}
              >
                <Pencil className="h-3 w-3 text-foreground-muted" aria-hidden />
              </button>
            )}
            {onRemoveSection && (
              <button
                type="button"
                onClick={onRemoveSection}
                className={cn("p-0.5 hover:bg-sidebar-accent rounded", revealOnHover)}
                title={t.removeSectionTitle}
                aria-label={`${t.removeSectionTitle}: ${section.label}`}
              >
                <Trash2 className="h-3 w-3 text-foreground-muted" aria-hidden />
              </button>
            )}
          </>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-0.5">
            {items.map((item) => (
              <SortablePinnedItem
                key={item.id}
                item={item}
                onUnpin={() => onUnpin(item.id)}
                renderLink={renderLink}
                resolveIcon={resolveIcon}
                unpinLabel={t.unpinTitle}
                dragHandleLabel={t.dragHandle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
