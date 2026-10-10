import Image from "next/image";
import { siteImage } from "../site";
import { cx } from "../ui";

/** The dim marble photograph that fades out to the right behind left-hand content. */
export function Backdrop({
  position = "fixed",
  preload = false,
  src = siteImage("hero-backdrop.jpg"),
  mask = "default",
}: {
  position?: "fixed" | "absolute";
  preload?: boolean;
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
        preload={preload}
      />
    </div>
  );
}
