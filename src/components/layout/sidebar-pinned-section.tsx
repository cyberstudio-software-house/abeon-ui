import * as React from "react";
import {
  Pin,
  PinOff,
  Pencil,
  Trash2,
  Check,
  X,
  GripVertical,
} from "lucide-react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { Input } from "../input";
import { getIconByName } from "../icon-picker";

export interface PinnedItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  sectionId: string;
  order: number;
  isActive?: boolean;
}

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
}

const defaultLabels: Required<SidebarPinnedSectionLabels> = {
  unpinTitle: "Unpin",
  editSectionTitle: "Rename section",
  removeSectionTitle: "Remove section",
  saveLabel: "Save",
  cancelLabel: "Cancel",
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
  renderLink?: (props: {
    href: string;
    isActive: boolean;
    className: string;
    children: React.ReactNode;
  }) => React.ReactNode;
  /** Override icon resolution. Default: looks up via IconPicker registry. */
  resolveIcon?: (iconName: string) => React.ComponentType<{ className?: string }> | undefined;
  className?: string;
  labels?: SidebarPinnedSectionLabels;
}

export function SidebarPinnedSection({
  section,
  items,
  collapsed = false,
  onReorder,
  onUnpin,
  onRenameSection,
  onRemoveSection,
  renderLink,
  resolveIcon = getIconByName as (
    name: string
  ) => React.ComponentType<{ className?: string }> | undefined,
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
    onRenameSection?.(editLabel);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditLabel(section.label);
    setIsEditing(false);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("mb-2", className)}>
      {!collapsed && (
        <div className="group flex items-center gap-1 px-2 py-1.5">
          {isEditing ? (
            <div className="flex items-center gap-1 flex-1">
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="h-6 text-xs px-2"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveLabel();
                  if (e.key === "Escape") handleCancelEdit();
                }}
              />
              <button
                onClick={handleSaveLabel}
                className="p-0.5 hover:bg-sidebar-accent rounded"
                aria-label={t.saveLabel}
              >
                <Check className="h-3.5 w-3.5 text-primary" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-0.5 hover:bg-sidebar-accent rounded"
                aria-label={t.cancelLabel}
              >
                <X className="h-3.5 w-3.5 text-foreground-muted" />
              </button>
            </div>
          ) : (
            <>
              <span className="text-xs font-medium uppercase tracking-wider text-foreground-muted flex items-center gap-1.5 px-1">
                <Pin className="h-3 w-3" />
                {section.label}
              </span>
              <div className="flex-1" />
              {onRenameSection && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-sidebar-accent rounded transition-all"
                  title={t.editSectionTitle}
                >
                  <Pencil className="h-3 w-3 text-foreground-muted" />
                </button>
              )}
              {onRemoveSection && (
                <button
                  onClick={onRemoveSection}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-sidebar-accent rounded transition-all"
                  title={t.removeSectionTitle}
                >
                  <Trash2 className="h-3 w-3 text-foreground-muted" />
                </button>
              )}
            </>
          )}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={cn(
              "space-y-0.5",
              collapsed && "flex flex-col items-center"
            )}
          >
            {items.map((item) => (
              <SortablePinnedItem
                key={item.id}
                item={item}
                collapsed={collapsed}
                onUnpin={() => onUnpin(item.id)}
                renderLink={renderLink}
                resolveIcon={resolveIcon}
                unpinTitle={t.unpinTitle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

interface SortablePinnedItemProps {
  item: PinnedItem;
  collapsed: boolean;
  onUnpin: () => void;
  renderLink?: SidebarPinnedSectionProps["renderLink"];
  resolveIcon: (iconName: string) => React.ComponentType<{ className?: string }> | undefined;
  unpinTitle: string;
}

function SortablePinnedItem({
  item,
  collapsed,
  onUnpin,
  renderLink,
  resolveIcon,
  unpinTitle,
}: SortablePinnedItemProps) {
  const IconComponent = resolveIcon(item.iconName);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const linkClass = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    item.isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground",
    collapsed && "justify-center px-0 w-11 h-11"
  );

  const innerContent = (
    <>
      {IconComponent && <IconComponent className="shrink-0 h-[22px] w-[22px]" />}
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
    </>
  );

  const linkContent = renderLink ? (
    renderLink({
      href: item.href,
      isActive: !!item.isActive,
      className: linkClass,
      children: innerContent,
    })
  ) : (
    <a
      href={item.href}
      aria-current={item.isActive ? "page" : undefined}
      className={linkClass}
    >
      {innerContent}
    </a>
  );

  if (collapsed) {
    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{linkContent}</div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group flex items-center", isDragging && "opacity-50")}
    >
      <button
        {...listeners}
        {...attributes}
        className="opacity-0 group-hover:opacity-100 p-1 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4 text-foreground-muted" />
      </button>
      <div className="flex-1">{linkContent}</div>
      <button
        onClick={onUnpin}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-sidebar-accent transition-all"
        title={unpinTitle}
        aria-label={unpinTitle}
      >
        <PinOff className="h-4 w-4 text-foreground-muted" />
      </button>
    </div>
  );
}
