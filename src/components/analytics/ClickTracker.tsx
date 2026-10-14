"use client";

import { useEffect } from "react";
import { isAnalyticsEvent, track } from "@/lib/analytics";

const PROP_ATTRIBUTE = /^data-track-(.+)$/;

/**
 * One click listener for the whole site: a click on an element with `data-track` (or inside one) calls
 * track(name, props from its `data-track-*` attributes). Server Components mark links with trackAttrs() and need no
 * client code of their own.
 *
 * It never calls preventDefault: next/link still navigates client-side, tel:, Zalo and Messenger links open as before.
 * That is why the site does not use Umami's own `data-umami-event`: for a same-tab link the Umami tracker cancels the
 * click and sets location.href itself, which reloads the whole page and replays the splash.
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest("[data-track]");
      const name = element?.getAttribute("data-track");
      if (!element || !name || !isAnalyticsEvent(name)) return;
      const props: Record<string, string> = {};
      for (const attribute of element.getAttributeNames()) {
        const match = PROP_ATTRIBUTE.exec(attribute);
        const value = element.getAttribute(attribute);
        if (match && value !== null) props[match[1]] = value;
      }
      track(name, props);
    };
    // Capture phase: runs before next/link and motion handlers, even if one of them stops propagation.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
