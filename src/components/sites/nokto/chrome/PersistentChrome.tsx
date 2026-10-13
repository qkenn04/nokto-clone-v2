"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EASE_CINEMA } from "../motion";
import { site } from "../site";
import { Stack } from "../ui";
import { Backdrop } from "./Backdrop";
import { BrandMark } from "./BrandMark";
import { InfoItem } from "./SiteFooter";

type NavItemProps = {
  label: string;
  href: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  index: number;
  isActive: boolean;
  delay: number;
  reduce: boolean;
};

/** Hanko-style seal that fades in beside a hovered (or current) navigation item. */
function NavSeal({ image, alt, width, height, isActive }: { image: string; alt: string; width: number; height: number; isActive: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-[0.85em] shrink-0 items-center transition-opacity duration-500 ease-cinema ${
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      <Image src={image} alt="" width={width} height={height} unoptimized className="block h-full w-auto" />
      <span className="sr-only">{alt}</span>
    </span>
  );
}

function NavItem({ label, href, image, imageWidth, imageHeight, index, isActive, delay, reduce }: NavItemProps) {
  return (
    <motion.li
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE_CINEMA }}
      className="group relative border-b border-border-subtle"
    >
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`relative flex w-full items-baseline gap-6 py-10 transition-colors duration-[var(--duration-fast)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:py-12 ${
          isActive ? "text-accent" : "text-foreground hover:text-accent"
        }`}
      >
        <span className="type-label shrink-0 text-muted">{String(index).padStart(2, "0")}</span>
        <span
          className={`flex flex-1 items-center gap-3 font-display font-bold uppercase tracking-[-0.02em] leading-[var(--leading-none)] text-nav-item ${
            isActive ? "text-accent" : ""
          }`}
        >
          <span>{label}</span>
          <NavSeal image={image} alt={label} width={imageWidth} height={imageHeight} isActive={isActive} />
        </span>
      </Link>
    </motion.li>
  );
}

function LegalBar({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: EASE_CINEMA }}
      className="section-pad section-pad-y-sm absolute inset-x-0 bottom-0 border-t border-border-subtle"
    >
      <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
        {site.legal.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onClose}
              className="type-label text-muted transition-colors duration-[var(--duration-fast)] hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/** Fixed "Menu" trigger plus the full-screen navigation dialog. */
function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion() ?? false;

  // Close the dialog whenever the route changes (adjusting state during render, per React guidance).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Trap focus inside the dialog while it is open.
  useEffect(() => {
    if (!open) return;
    const dialog = document.getElementById("primary-menu");
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    dialog.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: EASE_CINEMA }}
        className="section-pad section-pad-y pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-end"
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="primary-menu"
          aria-label={open ? "Đóng điều hướng" : "Mở điều hướng"}
          onClick={() => setOpen((value) => !value)}
          className="pointer-events-auto inline-flex items-center gap-3 text-small uppercase tracking-[var(--tracking-label)] text-foreground transition-colors duration-[var(--duration-fast)] hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {open ? (
            <>
              <span>Đóng</span>
              <X aria-hidden className="h-4 w-4" strokeWidth={1.25} />
            </>
          ) : (
            <>
              <span aria-hidden className="block h-px w-8 bg-current" />
              <span>Menu</span>
            </>
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="primary-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Điều hướng chính"
            data-lenis-prevent
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_CINEMA }}
            className="fixed inset-0 z-50 bg-background focus:outline-none"
          >
            <Backdrop position="absolute" />
            <div className="section-pad section-pad-y pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between">
              <div className="pointer-events-auto">
                <BrandMark onNavigate={() => setOpen(false)} />
              </div>
            </div>
            <div className="section-pad relative grid h-full grid-cols-1 items-center gap-12 py-32 sm:py-36 md:py-40 lg:grid-cols-[1fr_minmax(220px,auto)] lg:gap-20 lg:py-24">
              <nav aria-label="Các trang" className="self-center">
                <ul className="flex flex-col">
                  {site.nav.map((item, index) => (
                    <NavItem
                      key={item.href}
                      {...item}
                      index={index + 1}
                      isActive={pathname === item.href || pathname.startsWith(`${item.href}/`) || (item.href === "/menu" && pathname === "/the-hot/menu")}
                      delay={0.1 + 0.08 * index}
                      reduce={reduce}
                    />
                  ))}
                </ul>
              </nav>
              <motion.aside
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: EASE_CINEMA }}
                className="hidden self-center lg:block"
              >
                <Stack gap={8}>
                  <InfoItem label="Địa chỉ" value={site.address.display} />
                  <InfoItem label="Giờ mở cửa" value={site.hours.display} />
                  <InfoItem label="Facebook" value={site.social} href={site.socialHref} />
                </Stack>
              </motion.aside>
            </div>
            <LegalBar onClose={() => setOpen(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/** Logo pinned top-left on inner pages; it fades out over the first 220px of scrolling. */
function FixedBrand() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 220], [1, 0], { clamp: true });
  return (
    <motion.div style={{ opacity }} className="section-pad section-pad-y fixed left-0 top-0 z-30">
      <BrandMark size="compact" />
    </motion.div>
  );
}

/** Chrome that persists across routes: navigation everywhere, backdrop and fixed logo on inner pages. */
export function PersistentChrome() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <>
      <SiteNavigation />
      {!isHome && <Backdrop preload />}
      {!isHome && <FixedBrand />}
    </>
  );
}
