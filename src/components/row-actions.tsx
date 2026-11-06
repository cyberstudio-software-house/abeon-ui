import * as React from "react";
import { MoreHorizontal, Pencil } from "lucide-react";
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
   * The pencil. Pass `link` to render it as your router's link (it receives the icon as its
   * child), or `onClick` for anything else.
   */
  edit?: { label: string; onClick?: () => void; link?: React.ReactElement };
  /** Everything else, behind ⋯. A separator comes before the first `danger` entry. */
  actions?: RowAction[];
  moreLabel?: string;
}

/** The end of a record row: edit as an icon, the rest in a menu. */
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
            <IconButton
              asChild
              size="sm"
              tooltip={edit.label}
              aria-label={edit.label}
            >
              {React.cloneElement(edit.link, {}, <Pencil />)}
            </IconButton>
          ) : (
            <IconButton
              size="sm"
              tooltip={edit.label}
              aria-label={edit.label}
              onClick={edit.onClick}
            >
              <Pencil />
            </IconButton>
          ))}
        {visible.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton size="sm" aria-label={moreLabel}>
                <MoreHorizontal />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
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
