"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "../site";
import { useRestartPage } from "./PageTransition";

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
      <Image
        src={site.logo.src}
        alt={`${site.name} ${site.location}`}
        width={site.logo.width}
        height={site.logo.height}
        preload
        unoptimized
        className={`block w-auto shrink-0 ${size === "large" ? "h-28" : size === "compact" ? "h-12" : "h-16 sm:h-20 lg:h-[clamp(3.5rem,9vh,5rem)]"}`}
      />
    </Link>
  );
}
