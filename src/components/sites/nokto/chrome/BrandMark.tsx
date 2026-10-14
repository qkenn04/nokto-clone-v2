"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "../site";
import { useRestartPage } from "./PageTransition";

/** CSS width of the logo at a CSS height in px, rounded up. */
const widthAt = (height: number) => Math.ceil((height * site.logo.width) / site.logo.height);

/**
 * Height classes per size and the `sizes` that match them, so the browser fetches a file close to the rendered width
 * (phones: 86px, about a 256px-wide file at 1.75x) rather than the 640px original. The `lg` clamp never exceeds the
 * `sm` height, so the `sm` width covers it.
 */
const SIZES = {
  default: { className: "h-16 sm:h-20 lg:h-[clamp(3.5rem,9vh,5rem)]", sizes: `(min-width: 640px) ${widthAt(80)}px, ${widthAt(64)}px` },
  large: { className: "h-28", sizes: `${widthAt(112)}px` },
  compact: { className: "h-12", sizes: `${widthAt(48)}px` },
} as const;

/** `sizes` of the default logo; other logos reuse it so the browser picks the same, already cached file. */
export const LOGO_SIZES = SIZES.default.sizes;

/** Logo link. On the home page it replays the entrance instead of navigating. */
export function BrandMark({
  size = "default",
  onNavigate,
}: {
  size?: "default" | "large" | "compact";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const restart = useRestartPage();

  return (
    <Link
      href="/"
      onClick={(event) => {
        onNavigate?.();
        if (pathname === "/") {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "instant" });
          restart();
        }
      }}
      aria-label={`${site.name} ${site.location}`}
      className="inline-flex items-center transition-opacity duration-[var(--duration-fast)] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {/*
        Above the fold on every page, so eager, but low priority so it does not compete with the splash backdrop (the
        LCP image), which covers it on load. Low priority also stops React from hoisting a <link rel="preload"> for it.
        The fixed aspect ratio keeps the original's width: resized files round their height (256x192 vs 640x479).
      */}
      <Image
        src={site.logo.src}
        alt={`${site.name} ${site.location}`}
        width={site.logo.width}
        height={site.logo.height}
        sizes={SIZES[size].sizes}
        loading="eager"
        fetchPriority="low"
        style={{ aspectRatio: `${site.logo.width} / ${site.logo.height}` }}
        className={`block w-auto shrink-0 ${SIZES[size].className}`}
      />
    </Link>
  );
}
