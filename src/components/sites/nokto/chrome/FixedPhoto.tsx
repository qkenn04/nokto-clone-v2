import Image from "next/image";

/**
 * Desktop-only photograph pinned to the right half of the viewport while the left column scrolls.
 * Pair it with a `relative z-10 lg:w-1/2` content column inside `<main className="relative w-full">`.
 */
export function FixedPhoto({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed top-0 right-0 z-0 hidden h-dvh w-1/2 overflow-hidden lg:block"
    >
      <Image src={src} alt={alt} fill sizes="50vw" preload className="object-cover" />
    </aside>
  );
}
