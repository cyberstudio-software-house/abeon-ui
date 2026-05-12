import * as React from "react";
import { cn } from "../lib/utils";

export interface BlockBase {
  id: string;
  type: string;
  order: number;
  props?: unknown;
}

export interface BlockViewProps<B extends BlockBase> {
  block: B;
  selected?: boolean;
  onClick?: () => void;
}

export type BlockView<B extends BlockBase> = (
  props: BlockViewProps<B>
) => React.ReactElement | null;

export interface BlockRegistry<B extends BlockBase> {
  register: <T extends B>(type: T["type"], view: BlockView<T>) => void;
  unregister: (type: string) => void;
  get: (type: string) => BlockView<B> | undefined;
  has: (type: string) => boolean;
  types: () => string[];
}

export function createBlockRegistry<B extends BlockBase>(
  initial?: Record<string, BlockView<B>>
): BlockRegistry<B> {
  const map = new Map<string, BlockView<B>>(
    initial ? Object.entries(initial) : []
  );

  return {
    register(type, view) {
      map.set(type as string, view as BlockView<B>);
    },
    unregister(type) {
      map.delete(type);
    },
    get(type) {
      return map.get(type);
    },
    has(type) {
      return map.has(type);
    },
    types() {
      return Array.from(map.keys());
    },
  };
}

export interface BlockRendererProps<B extends BlockBase> {
  blocks: B[];
  registry: BlockRegistry<B>;
  selectedBlockId?: string | null;
  onBlockClick?: (blockId: string) => void;
  fallback?: (block: B) => React.ReactNode;
  showSelectionBadge?: boolean;
  className?: string;
}

const defaultFallback = <B extends BlockBase>(block: B) => (
  <div className="p-8 text-center text-muted-foreground">
    Unknown block: {block.type}
  </div>
);

export function BlockRenderer<B extends BlockBase>({
  blocks,
  registry,
  selectedBlockId,
  onBlockClick,
  fallback = defaultFallback,
  showSelectionBadge = true,
  className,
}: BlockRendererProps<B>) {
  const sorted = React.useMemo(
    () => [...blocks].sort((a, b) => a.order - b.order),
    [blocks]
  );

  return (
    <div className={cn("min-h-full", className)}>
      {sorted.map((block) => {
        const View = registry.get(block.type);
        const isSelected = selectedBlockId === block.id;
        const handleClick = onBlockClick ? () => onBlockClick(block.id) : undefined;

        return (
          <div
            key={block.id}
            onClick={handleClick}
            className={cn(
              "relative transition-all",
              onBlockClick && "cursor-pointer hover:ring-2 hover:ring-primary/30",
              isSelected && "ring-2 ring-primary"
            )}
          >
            {View ? (
              <View block={block} selected={isSelected} onClick={handleClick} />
            ) : (
              fallback(block)
            )}
            {showSelectionBadge && isSelected && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">
                {block.type}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
