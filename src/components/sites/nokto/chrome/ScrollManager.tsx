"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SCROLLING_ROUTES = ["/menu", "/about", "/reservation", "/terms", "/privacy"];

/** Unlocks document scrolling on every route except the single-viewport home page (desktop). */
export function ScrollManager() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const root = document.documentElement;
    const scrolls = SCROLLING_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    root.classList.toggle("route-scroll", scrolls);
    return () => root.classList.remove("route-scroll");
  }, [pathname]);

  return null;
}
