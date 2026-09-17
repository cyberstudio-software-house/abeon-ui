import * as React from "react";
import { Pin, PinOff, MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";
import { revealOnHover } from "../../lib/reveal-on-hover";
import { IconPicker, getIconByName, type IconPickerLabels } from "../icon-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";

export interface PinItemPayload {
  id: string;
  label: string;
  href: string;
  iconName: string;
  /** The section chosen in the dialog; absent when no sections were offered. */
  sectionId?: string;
}

export interface PinSectionOption {
  id: string;
  label: string;
}

export interface PinItemDialogLabels {
  title?: string;
  description?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  iconLabel?: string;
  changeIconButton?: string;
  sectionLabel?: string;
  cancel?: string;
  confirm?: string;
  iconPicker?: IconPickerLabels;
}

const defaultDialogLabels: Required<Omit<PinItemDialogLabels, "iconPicker">> = {
  title: "Pin to menu",
  description: "The item appears in the pinned part of the sidebar.",
  nameLabel: "Name",
  namePlaceholder: "Item name",
  iconLabel: "Icon",
  changeIconButton: "Change icon",
  sectionLabel: "Section",
  cancel: "Cancel",
  confirm: "Pin",
};

const FALLBACK_ICON = "Star";

export interface PinItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemLabel: string;
  itemHref: string;
  /** The item's own icon name. Offered as the pin's icon; a star only when it is unknown. */
  defaultIcon?: string;
  /** Sections the pin can go to. With none, no section field is shown. */
  sections?: PinSectionOption[];
  defaultSectionId?: string;
  onConfirm: (payload: PinItemPayload) => void;
  labels?: PinItemDialogLabels;
}

export function PinItemDialog({
  open,
  onOpenChange,
  itemId,
  itemLabel,
  itemHref,
  defaultIcon,
  sections,
  defaultSectionId,
  onConfirm,
  labels,
}: PinItemDialogProps) {
  const t = { ...defaultDialogLabels, ...labels };
  const initialIcon = defaultIcon && getIconByName(defaultIcon) ? defaultIcon : FALLBACK_ICON;
  const initialSection = defaultSectionId ?? sections?.[0]?.id;
  const [selectedIcon, setSelectedIcon] = React.useState(initialIcon);
  const [label, setLabel] = React.useState(itemLabel);
  const [sectionId, setSectionId] = React.useState(initialSection);
  const nameId = React.useId();
  const iconId = React.useId();
  const sectionFieldId = React.useId();

  React.useEffect(() => {
    if (open) {
      setLabel(itemLabel);
      setSelectedIcon(initialIcon);
      setSectionId(initialSection);
    }
  }, [open, itemLabel, initialIcon, initialSection]);

  const trimmed = label.trim();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (trimmed === "") {
      return;
    }
    onConfirm({
      id: itemId,
      label: trimmed,
      href: itemHref,
      iconName: selectedIcon,
      ...(sections && sections.length > 0 && sectionId ? { sectionId } : {}),
    });
    onOpenChange(false);
  };

  const SelectedIcon = getIconByName(selectedIcon);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor={nameId}>{t.nameLabel}</Label>
              <Input
                id={nameId}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={t.namePlaceholder}
                required
                aria-invalid={trimmed === ""}
              />
            </div>
            <div className="space-y-2">
              <Label id={iconId}>{t.iconLabel}</Label>
              <div className="flex items-center gap-3" role="group" aria-labelledby={iconId}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                  {SelectedIcon && <SelectedIcon className="h-5 w-5 text-primary" aria-hidden />}
                </div>
                <IconPicker
                  value={selectedIcon}
                  onChange={setSelectedIcon}
                  labels={labels?.iconPicker}
                  trigger={
                    <Button type="button" variant="outline" size="sm">
                      {t.changeIconButton}
                    </Button>
                  }
                />
              </div>
            </div>
            {sections && sections.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor={sectionFieldId}>{t.sectionLabel}</Label>
                <select
                  id={sectionFieldId}
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={trimmed === ""}>
              {t.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export interface NavItemActionsLabels {
  triggerLabel?: string;
  pinAction?: string;
  unpinAction?: string;
  pinDialog?: PinItemDialogLabels;
}

const defaultActionLabels: Required<Omit<NavItemActionsLabels, "pinDialog">> = {
  triggerLabel: "Item actions",
  pinAction: "Pin to menu",
  unpinAction: "Unpin",
};

export interface NavItemActionsProps {
  itemId: string;
  itemLabel: string;
  itemHref: string;
  isPinned: boolean;
  onPin: (payload: PinItemPayload) => void;
  onUnpin: () => void;
  defaultIcon?: string;
  sections?: PinSectionOption[];
  defaultSectionId?: string;
  /** Merged with the default classes, which keep the trigger visible on focus, while open and on touch screens. */
  className?: string;
  labels?: NavItemActionsLabels;
}

export function NavItemActions({
  itemId,
  itemLabel,
  itemHref,
  isPinned,
  onPin,
  onUnpin,
  defaultIcon,
  sections,
  defaultSectionId,
  className,
  labels,
}: NavItemActionsProps) {
  const t = { ...defaultActionLabels, ...labels };
  const [pinDialogOpen, setPinDialogOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn("p-1 rounded hover:bg-sidebar-accent", revealOnHover, className)}
            aria-label={`${t.triggerLabel}: ${itemLabel}`}
          >
            <MoreHorizontal className="h-4 w-4 text-foreground-muted" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {isPinned ? (
            <DropdownMenuItem onSelect={onUnpin}>
              <PinOff className="mr-2 h-4 w-4" aria-hidden />
              {t.unpinAction}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => setPinDialogOpen(true)}>
              <Pin className="mr-2 h-4 w-4" aria-hidden />
              {t.pinAction}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <PinItemDialog
        open={pinDialogOpen}
        onOpenChange={setPinDialogOpen}
        itemId={itemId}
        itemLabel={itemLabel}
        itemHref={itemHref}
        defaultIcon={defaultIcon}
        sections={sections}
        defaultSectionId={defaultSectionId}
        onConfirm={onPin}
        labels={labels?.pinDialog}
      />
    </>
  );
}
