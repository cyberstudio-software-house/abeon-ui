import * as React from "react";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { TooltipProvider } from "./tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

export interface RowActionsProps {
  /**
   * The main action, shown as a text button and repeated first in the menu. Pass `link` to
   * render it as your router's link (it receives the label as its child), or `onClick` for
   * anything else. `ariaLabel` names the record for screen readers, e.g. "Edytuj „O nas”".
   */
  edit?: { label: string; ariaLabel?: string; onClick?: () => void; link?: React.ReactElement };
  /** Everything else, behind ⋯. A separator comes before the first `danger` entry. */
  actions?: RowAction[];
  moreLabel?: string;
}

/** The end of a record row: the main action as a text button, the rest in a menu. */
function RowActions({
  edit,
  actions = [],
  moreLabel = "Więcej akcji",
}: RowActionsProps) {
  const visible = actions.filter(Boolean);
  const firstDanger = visible.findIndex(
    (action) => action.variant === "danger",
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex shrink-0 items-center gap-0.5">
        {edit &&
          (edit.link ? (
            <Button asChild variant="ghost" size="sm" className="px-2">
              {React.cloneElement(edit.link, { "aria-label": edit.ariaLabel } as React.HTMLAttributes<HTMLElement>, edit.label)}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="px-2" aria-label={edit.ariaLabel} onClick={edit.onClick}>
              {edit.label}
            </Button>
          ))}
        {visible.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton size="sm" aria-label={moreLabel}>
                <MoreHorizontal />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              {edit && (
                <>
                  {edit.link ? (
                    <DropdownMenuItem asChild>
                      {React.cloneElement(edit.link, {}, <><span className="mr-2 flex h-4 w-4 items-center [&>svg]:h-4 [&>svg]:w-4"><Pencil /></span>{edit.label}</>)}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onSelect={edit.onClick}>
                      <span className="mr-2 flex h-4 w-4 items-center [&>svg]:h-4 [&>svg]:w-4"><Pencil /></span>
                      {edit.label}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                </>
              )}
              {visible.map((action, index) => (
                <React.Fragment key={action.label}>
                  {index === firstDanger && index > 0 && (
                    <DropdownMenuSeparator />
                  )}
                  <DropdownMenuItem
                    disabled={action.disabled}
                    onSelect={action.onClick}
                    className={
                      action.variant === "danger"
                        ? "text-danger focus:text-danger"
                        : undefined
                    }
                  >
                    {action.icon && (
                      <span className="mr-2 flex h-4 w-4 items-center [&>svg]:h-4 [&>svg]:w-4">
                        {action.icon}
                      </span>
                    )}
                    {action.label}
                  </DropdownMenuItem>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  );
}

export { RowActions };
