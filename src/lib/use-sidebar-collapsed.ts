import { useState, useEffect } from "react";

const STORAGE_KEY = "abeon:sidebar-collapsed";

export function useSidebarCollapsed(defaultCollapsed = false): [boolean, (collapsed: boolean) => void] {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? (JSON.parse(stored) as boolean) : defaultCollapsed;
    } catch {
      return defaultCollapsed;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    } catch {
    }
  }, [collapsed]);

  return [collapsed, setCollapsed];
}
