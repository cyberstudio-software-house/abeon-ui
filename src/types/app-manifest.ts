import type { LucideIcon } from "lucide-react";

export interface AppManifest {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  url: string;
  category?: string;
}

export interface AppCategory {
  label: string;
  appIds: string[];
}
