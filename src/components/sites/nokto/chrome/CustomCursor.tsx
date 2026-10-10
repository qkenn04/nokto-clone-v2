"use client";

import { useEffect, useRef } from "react";

/** A 12px dot that trails the pointer (fine pointers only, disabled for reduced motion). */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = ref.current;
    if (!dot) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let visible = false;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
      }
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
    };
    const render = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = window.requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame = window.requestAnimationFrame(render);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] h-3 w-3 rounded-full bg-foreground opacity-0 transition-opacity duration-300"
      style={{ willChange: "transform" }}
    />
  );
}
