"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent } from "react";
import styles from "./HomeContent.module.css";

export type LightboxImage = { src: string; alt: string; title: string; caption?: string };

export function ImageLightbox({ images, index, onIndexChange, onClose }: {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const activeIndex = index ?? 0;
  const photo = images[activeIndex] ?? images[0];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const move = (direction: number) => onIndexChange((activeIndex + direction + images.length) % images.length);
  const handleKey = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      onIndexChange(event.key === "Home" ? 0 : images.length - 1);
    }
  };

  if (!photo) return null;

  return (
    <dialog ref={dialogRef} className={styles.lightbox} aria-label={`Xem ảnh: ${photo.title}`} onClose={onClose} onKeyDown={handleKey} data-lenis-prevent>
      <div className={styles.lightboxLayout}>
        <header className={styles.lightboxHeader}>
          <div>
            <p className="type-label text-muted">The Hot · {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</p>
            <h2 className={styles.lightboxTitle}>{photo.title}</h2>
          </div>
          <button type="button" className={styles.iconButton} aria-label="Đóng ảnh" onClick={() => dialogRef.current?.close()}>
            <X aria-hidden size={20} strokeWidth={1.5} />
          </button>
        </header>
        <div
          className={styles.lightboxImage}
          onPointerDown={(event) => {
            if (!event.isPrimary) return;
            pointerStart.current = { x: event.clientX, y: event.clientY };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { pointerStart.current = null; }}
          onPointerUp={(event) => {
            const start = pointerStart.current;
            pointerStart.current = null;
            if (!start || images.length < 2) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
          }}
        >
          <Image src={photo.src} alt={photo.alt} fill sizes="100vw" unoptimized className="object-contain" />
        </div>
        <footer className={styles.lightboxFooter}>
          <button type="button" className={styles.iconButton} aria-label="Ảnh trước" disabled={images.length < 2} onClick={() => move(-1)}>
            <ChevronLeft aria-hidden size={20} strokeWidth={1.5} />
          </button>
          <p>{photo.caption ?? "The Hot Beer Garden · Đà Lạt"}</p>
          <button type="button" className={styles.iconButton} aria-label="Ảnh sau" disabled={images.length < 2} onClick={() => move(1)}>
            <ChevronRight aria-hidden size={20} strokeWidth={1.5} />
          </button>
        </footer>
      </div>
    </dialog>
  );
}
