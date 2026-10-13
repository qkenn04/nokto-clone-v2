"use client";

import { Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePageTick } from "../nokto/chrome/PageTransition";
import { EASE_CINEMA } from "../nokto/motion";
import styles from "./HeroVideo.module.css";

/** Muted looping hero, with a poster and a keyboard-accessible playback control. */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const reduce = useReducedMotion();
  const tick = usePageTick();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce === null) return;
    if (reduce) {
      video.pause();
    } else {
      // Autoplay can be blocked by browser preferences; the play button remains available.
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

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

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
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
        <div aria-hidden="true" className={styles.overlay} />
      </motion.div>
      {!failed ? (
        <div className="section-pad section-pad-y pointer-events-none absolute inset-0 z-10 flex items-end justify-end max-lg:pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={togglePlayback}
            aria-controls="home-hero-video"
            aria-label={playing ? "Tạm dừng video" : "Phát video"}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-3 text-small text-white backdrop-blur-sm transition-colors hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {playing ? <Pause aria-hidden size={16} /> : <Play aria-hidden size={16} />}
            <span>{playing ? "Tạm dừng" : "Phát video"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
