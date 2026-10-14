"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePageTick } from "../nokto/chrome/PageTransition";
import { EASE_CINEMA } from "../nokto/motion";
import styles from "./HeroVideo.module.css";

/** Muted looping hero with a poster fallback. */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const reduce = useReducedMotion();
  const tick = usePageTick();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce === null) return;
    if (reduce) {
      video.pause();
    } else {
      // Keep the poster visible when browser preferences block autoplay.
      void video.play().catch(() => {});
    }

    let resumeOnReturn = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        resumeOnReturn = !video.paused;
        video.pause();
      } else if (resumeOnReturn) {
        resumeOnReturn = false;
        void video.play().catch(() => {});
      }
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce, tick]);

  return (
    <div className="relative isolate h-full w-full bg-background">
      <motion.div
        key={tick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.3 : 1.2, ease: EASE_CINEMA }}
        className="absolute inset-0"
      >
        {failed ? (
          <Image
            src={poster}
            alt="Không gian The Hot Beer Garden Đà Lạt"
            fill
            sizes="(max-width: 1023px) 100vw, 55vw"
            className="object-cover"
          />
        ) : (
          <video
            id="home-hero-video"
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
        <div aria-hidden="true" className={styles.overlay} />
      </motion.div>
    </div>
  );
}
