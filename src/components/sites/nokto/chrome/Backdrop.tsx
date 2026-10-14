import Image from "next/image";
import { siteImage } from "../site";
import { cx } from "../ui";

/**
 * The dim marble photograph that fades out to the right behind left-hand content.
 *
 * `priority` is for a backdrop on screen at first paint (the splash, inner pages), where it can be the Largest
 * Contentful Paint: the image loads eagerly at high fetch priority, and React hoists a matching
 * `<link rel="preload" fetchpriority="high">`. Next 16 recommends this over `preload`, whose preload link carries no
 * priority, so the browser fetches it as a low-priority image.
 */
export function Backdrop({
  position = "fixed",
  priority = false,
  src = siteImage("hero-backdrop.jpg"),
  mask = "default",
}: {
  position?: "fixed" | "absolute";
  priority?: boolean;
  src?: string;
  mask?: "default" | "soft";
}) {
  return (
    <div
      aria-hidden
      className={cx(
        mask === "soft" ? "mask-fade-right-hero" : "mask-fade-right",
        position,
        "pointer-events-none inset-y-0 left-0 z-0 w-3/4 overflow-hidden md:w-2/3 lg:w-[45%]",
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 75vw, (max-width: 1024px) 66vw, 45vw"
        quality={55}
        className="object-cover object-left opacity-35"
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
      />
    </div>
  );
}
