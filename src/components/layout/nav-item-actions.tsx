import * as React from "react";
import { Pin, PinOff, MoreHorizontal } from "lucide-react";
import { IconPicker, getIconByName } from "../icon-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import {
  Dialog,
  DialogContent,
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
}

export interface PinItemDialogLabels {
  title?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  iconLabel?: string;
  changeIconButton?: string;
  cancel?: string;
  confirm?: string;
}

const defaultDialogLabels: Required<PinItemDialogLabels> = {
  title: "Pin to menu",
  nameLabel: "Name",
  namePlaceholder: "Item name",
  iconLabel: "Icon",
  changeIconButton: "Change icon",
  cancel: "Cancel",
  confirm: "Pin",
};

export interface PinItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemLabel: string;
  itemHref: string;
  defaultIcon?: string;
  onConfirm: (payload: PinItemPayload) => void;
  labels?: PinItemDialogLabels;
}

export function PinItemDialog({
  open,
  onOpenChange,
  itemId,
  itemLabel,
  itemHref,
  defaultIcon = "Star",
  onConfirm,
  labels,
}: PinItemDialogProps) {
  const t = { ...defaultDialogLabels, ...labels };
  const [selectedIcon, setSelectedIcon] = React.useState(defaultIcon);
  const [label, setLabel] = React.useState(itemLabel);

  React.useEffect(() => {
    if (open) {
      setLabel(itemLabel);
      setSelectedIcon(defaultIcon);
    }
  }, [open, itemLabel, defaultIcon]);

  const handleConfirm = () => {
    onConfirm({
      id: itemId,
      label,
      href: itemHref,
      iconName: selectedIcon,
    });
    onOpenChange(false);
  };

  const SelectedIcon = getIconByName(selectedIcon);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pin-name">{t.nameLabel}</Label>
            <Input
              id="pin-name"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t.namePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label>{t.iconLabel}</Label>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                {SelectedIcon && <SelectedIcon className="h-5 w-5 text-primary" />}
              </div>
              <IconPicker
                value={selectedIcon}
                onChange={setSelectedIcon}
                trigger={
                  <Button variant="outline" size="sm">
                    {t.changeIconButton}
                  </Button>
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleConfirm}>{t.confirm}</Button>
        </DialogFooter>
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
            className={
              className ??
              "opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-sidebar-accent transition-all"
            }
            aria-label={t.triggerLabel}
          >
            <MoreHorizontal className="h-4 w-4 text-foreground-muted" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {isPinned ? (
            <DropdownMenuItem onClick={onUnpin}>
              <PinOff className="mr-2 h-4 w-4" />
              {t.unpinAction}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setPinDialogOpen(true)}>
              <Pin className="mr-2 h-4 w-4" />
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
        onConfirm={onPin}
        labels={labels?.pinDialog}
      />
    </>
  );
}
