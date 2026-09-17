function saveDataRequested(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

/**
 * Adds `<link rel="prefetch">` for a same-origin page once, so the next full-page
 * navigation to another application starts from a warm cache (architecture §3.7,
 * ADR-0013). Cross-origin URLs, the current page and data-saver mode are skipped.
 *
 * @returns whether a link was added
 */
export function prefetchOnce(href: string | null | undefined): boolean {
  if (!href || typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }

  url.hash = "";
  const current = new URL(window.location.href);
  current.hash = "";

  if (url.origin !== window.location.origin || url.href === current.href || saveDataRequested()) {
    return false;
  }

  const existing = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="prefetch"]'));
  if (existing.some((link) => link.href === url.href)) {
    return false;
  }

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url.href;
  document.head.appendChild(link);

  return true;
}

export function prefetchHandlers(href: string | null | undefined, enabled: boolean = true) {
  if (!enabled) {
    return {};
  }

  const prefetch = () => {
    prefetchOnce(href);
  };

  return { onPointerEnter: prefetch, onFocus: prefetch };
}
