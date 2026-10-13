"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { EASE_CINEMA } from "../motion";
import { site } from "../site";
import { Backdrop } from "./Backdrop";

const STORAGE_KEY = "the-hot:preloader-shown";

function alreadyShown() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Logo intro shown once per browser tab (tracked in sessionStorage, as on the source). */
export function Preloader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (alreadyShown()) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage can be unavailable (private mode); the intro then shows on every load.
    }
    // sessionStorage is browser-only, so the overlay can only be mounted after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, []);

  // Separate from the effect above so a re-run (Strict Mode, reduced-motion change) cannot cancel the exit.
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), reduce ? 500 : 1600);
    return () => window.clearTimeout(timer);
  }, [visible, reduce]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.3 : 0.8, ease: EASE_CINEMA }}
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-background"
        >
          <Backdrop position="absolute" preload />
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={
              reduce
                ? { duration: 0.3, ease: EASE_CINEMA }
                : {
                    opacity: { duration: 0.9, delay: 0.05, ease: EASE_CINEMA },
                    scale: { duration: 1.4, delay: 0.05, ease: EASE_CINEMA },
                  }
            }
            className="relative flex items-center justify-center"
          >
            <Image
              src={site.logo.src}
              alt={`${site.name} ${site.location}`}
              width={site.logo.width}
              height={site.logo.height}
              preload
              unoptimized
              className="block h-28 w-auto"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
