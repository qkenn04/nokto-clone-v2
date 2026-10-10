"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ASSET_BASE, site } from "../site";
import { useRestartPage } from "./PageTransition";

/** NOKTO logo link. On the home page it replays the entrance instead of navigating. */
export function BrandMark({ size = "default", onNavigate }: { size?: "default" | "large"; onNavigate?: () => void }) {
  const pathname = usePathname();
  const restart = useRestartPage();

  return (
    <Link
      href="/"
      onClick={(event) => {
        onNavigate?.();
        if (pathname === "/") {
          event.preventDefault();
          restart();
        }
      }}
      aria-label={site.name}
      className="inline-flex items-center transition-opacity duration-[var(--duration-fast)] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <Image
        src={`${ASSET_BASE}/logo.svg`}
        alt={site.name}
        width={954}
        height={187}
        preload
        unoptimized
        className={`block w-auto shrink-0 ${size === "large" ? "h-[3.125rem]" : "h-5"}`}
      />
    </Link>
  );
}
