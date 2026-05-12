import * as React from "react";
import { Menu, ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { useIsMobile } from "../../lib/use-mobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../resizable";
import { Sheet, SheetContent, SheetTrigger } from "../sheet";
import { Button } from "../button";

export type InboxPane = "list" | "preview";

export interface InboxLayoutLabels {
  foldersTrigger?: string;
  backToList?: string;
  emptyPreview?: string;
}

const defaultLabels: Required<InboxLayoutLabels> = {
  foldersTrigger: "Folders",
  backToList: "Back",
  emptyPreview: "Select a message to preview.",
};

export interface InboxLayoutProps {
  folders: React.ReactNode;
  list: React.ReactNode;
  preview?: React.ReactNode;
  /** Default flex sizes (sum to 100) for the three desktop panels. */
  defaultLayout?: [number, number, number];
  /** Min sizes per panel (percent). */
  minSize?: { folders?: number; list?: number; preview?: number };
  /** Which pane is visible on mobile (<768px). Controlled by parent. */
  mobileActivePane?: InboxPane;
  onMobileActivePaneChange?: (pane: InboxPane) => void;
  /** Collapse the layout to two panes (list + preview only, folders in a Sheet) regardless of viewport. */
  forceTwoPane?: boolean;
  /** Hide the preview entirely (folders + list only). */
  hidePreview?: boolean;
  className?: string;
  labels?: InboxLayoutLabels;
}

export function InboxLayout({
  folders,
  list,
  preview,
  defaultLayout = [20, 30, 50],
  minSize,
  mobileActivePane = "list",
  onMobileActivePaneChange,
  forceTwoPane = false,
  hidePreview = false,
  className,
  labels,
}: InboxLayoutProps) {
  const t = { ...defaultLabels, ...labels };
  const isMobile = useIsMobile();
  const [foldersOpen, setFoldersOpen] = React.useState(false);

  const showThreePane = !isMobile && !forceTwoPane;
  const showTwoPane = !isMobile && forceTwoPane;

  // Mobile: stacked, one pane at a time
  if (isMobile) {
    return (
      <div className={cn("flex h-full w-full flex-col", className)}>
        <div className="flex items-center gap-2 border-b border-border bg-background px-3 py-2">
          {mobileActivePane === "preview" && preview && !hidePreview ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMobileActivePaneChange?.("list")}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t.backToList}
            </Button>
          ) : (
            <Sheet open={foldersOpen} onOpenChange={setFoldersOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="mr-1 h-4 w-4" />
                  {t.foldersTrigger}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                {folders}
              </SheetContent>
            </Sheet>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          {mobileActivePane === "list" || hidePreview || !preview
            ? list
            : preview}
        </div>
      </div>
    );
  }

  // Tablet / forced two-pane: list + preview, folders in Sheet
  if (showTwoPane) {
    return (
      <div className={cn("flex h-full w-full flex-col", className)}>
        <div className="flex items-center gap-2 border-b border-border bg-background px-3 py-2">
          <Sheet open={foldersOpen} onOpenChange={setFoldersOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="mr-1 h-4 w-4" />
                {t.foldersTrigger}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              {folders}
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              defaultSize={hidePreview ? 100 : 40}
              minSize={minSize?.list ?? 25}
            >
              {list}
            </ResizablePanel>
            {!hidePreview && preview && (
              <>
                <ResizableHandle />
                <ResizablePanel
                  defaultSize={60}
                  minSize={minSize?.preview ?? 30}
                >
                  {preview}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    );
  }

  // Desktop three-pane (or two-pane if hidePreview)
  return (
    <div className={cn("h-full w-full overflow-hidden", className)}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          minSize={minSize?.folders ?? 12}
        >
          {folders}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={hidePreview ? 100 - defaultLayout[0] : defaultLayout[1]}
          minSize={minSize?.list ?? 20}
        >
          {list}
        </ResizablePanel>
        {!hidePreview && preview && (
          <>
            <ResizableHandle />
            <ResizablePanel
              defaultSize={defaultLayout[2]}
              minSize={minSize?.preview ?? 25}
            >
              {preview}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
