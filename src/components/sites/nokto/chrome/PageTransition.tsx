"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { EASE_CINEMA } from "../motion";

const PageTransitionContext = createContext({ restart: () => {}, tick: 0 });

/** Replays the current page's entrance (used when the logo is clicked on the home page). */
export function useRestartPage() {
  return useContext(PageTransitionContext).restart;
}

/** Increments each time the page entrance is replayed; use it as a React key to remount animations. */
export function usePageTick() {
  return useContext(PageTransitionContext).tick;
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  const restart = useCallback(() => setTick((value) => value + 1), []);
  const value = useMemo(() => ({ restart, tick }), [restart, tick]);

  return (
    <PageTransitionContext.Provider value={value}>
      <motion.div
        key={pathname}
        // The first page load relies on each section's own entrance; route changes fade the page in.
        // eslint-disable-next-line react-hooks/refs
        initial={!firstRender.current && { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.15 : 0.35, ease: EASE_CINEMA }}
        className="w-full lg:h-full"
      >
        {children}
      </motion.div>
    </PageTransitionContext.Provider>
  );
}
