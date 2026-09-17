import * as React from "react";
import { PinOff, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import { revealOnHover } from "../../lib/reveal-on-hover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

export interface PinnedItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  sectionId: string;
  order: number;
  isActive?: boolean;
  /** A muted note after the label, such as the application the pin opens: "Kontakty · CRM". */
  caption?: string | null;
}

export type RenderPinnedLink = (props: {
  href: string;
  isActive: boolean;
  className: string;
  children: React.ReactNode;
}) => React.ReactNode;

export type ResolvePinnedIcon = (iconName: string) => React.ComponentType<{ className?: string }> | undefined;

interface PinnedLinkProps {
  item: PinnedItem;
  collapsed: boolean;
  renderLink?: RenderPinnedLink;
  resolveIcon: ResolvePinnedIcon;
}

function PinnedLink({ item, collapsed, renderLink, resolveIcon }: PinnedLinkProps) {
  const IconComponent = resolveIcon(item.iconName);

  const className = cn(
    "flex min-w-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    item.isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
    collapsed && "justify-center px-0 w-11 h-11"
  );

  const children = (
    <>
      {IconComponent && <IconComponent className="shrink-0 h-[22px] w-[22px]" />}
      {!collapsed && (
        <span className="min-w-0 flex-1 truncate">
          {item.label}
          {item.caption && <span className="text-xs font-normal text-foreground-muted"> · {item.caption}</span>}
        </span>
      )}
    </>
  );

  if (renderLink) {
    return <>{renderLink({ href: item.href, isActive: !!item.isActive, className, children })}</>;
  }

  return (
    <a href={item.href} aria-current={item.isActive ? "page" : undefined} className={className}>
      {children}
    </a>
  );
}

export interface CollapsedPinnedItemProps {
  item: PinnedItem;
  renderLink?: RenderPinnedLink;
  resolveIcon: ResolvePinnedIcon;
}

/**
 * A pin in the collapsed sidebar: an icon with its name in a tooltip. Not sortable —
 * the sortable attributes used to be spread here without the listeners, which added a
 * focusable element per pin that did nothing.
 */
export function CollapsedPinnedItem({ item, renderLink, resolveIcon }: CollapsedPinnedItemProps) {
  const name = item.caption ? `${item.label} · ${item.caption}` : item.label;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <PinnedLink item={item} collapsed renderLink={renderLink} resolveIcon={resolveIcon} />
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8} className="font-medium">
        {name}
      </TooltipContent>
    </Tooltip>
  );
}

export interface SortablePinnedItemProps {
  item: PinnedItem;
  onUnpin: () => void;
  renderLink?: RenderPinnedLink;
  resolveIcon: ResolvePinnedIcon;
  unpinLabel: string;
  dragHandleLabel: string;
}

export function SortablePinnedItem({
  item,
  onUnpin,
  renderLink,
  resolveIcon,
  unpinLabel,
  dragHandleLabel,
}: SortablePinnedItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { sectionId: item.sectionId },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group flex items-center", isDragging && "opacity-50")}
      data-pin-id={item.id}
    >
      <button
        type="button"
        {...listeners}
        {...attributes}
        className={cn("p-1 cursor-grab active:cursor-grabbing rounded", revealOnHover)}
        aria-label={`${dragHandleLabel}: ${item.label}`}
      >
        <GripVertical className="h-4 w-4 text-foreground-muted" aria-hidden />
      </button>
      <div className="min-w-0 flex-1">
        <PinnedLink item={item} collapsed={false} renderLink={renderLink} resolveIcon={resolveIcon} />
      </div>
      <button
        type="button"
        onClick={onUnpin}
        className={cn("p-1 rounded hover:bg-sidebar-accent", revealOnHover)}
        title={unpinLabel}
        aria-label={`${unpinLabel}: ${item.label}`}
      >
        <PinOff className="h-4 w-4 text-foreground-muted" aria-hidden />
      </button>
    </div>
  );
}
