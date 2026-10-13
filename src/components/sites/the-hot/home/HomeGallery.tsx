"use client";

import { ArrowUpRight, Maximize2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { EASE_CINEMA } from "../../nokto/motion";
import { Heading, Section, Stack, Text, cx } from "../../nokto/ui";
import { galleryCategories, galleryPhotos, type GalleryCategory } from "./content";
import { ImageLightbox } from "./ImageLightbox";
import styles from "./HomeContent.module.css";

export function HomeGallery() {
  const reduce = useReducedMotion() ?? false;
  const [category, setCategory] = useState<GalleryCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const photos = galleryPhotos.filter(photo => category === "all" || photo.category === category);

  return (
    <Section id="gallery" padY="lg-tight" tone="background" relative className={styles.contentSection} aria-labelledby="home-gallery-title">
      <header className={styles.sectionHeader}>
        <Stack gap={4}>
          <Text variant="label" tone="accent">01 / Gallery</Text>
          <Heading as="h2" level="h1" id="home-gallery-title">Hội mình ở đây.</Heading>
          <Text tone="muted" measure="comfort">Nhạc lên, mồi lên bàn, hội bạn lên mood. Nhìn một vòng The Hot trước khi chốt kèo.</Text>
        </Stack>
        <a href="#events" className={styles.textLink}>Xem lịch lên mood <ArrowUpRight aria-hidden size={16} /></a>
      </header>

      <nav className={styles.filters} aria-label="Lọc ảnh gallery">
        {galleryCategories.map(item => (
          <button key={item.value} type="button" onClick={() => setCategory(item.value)} aria-pressed={category === item.value} className={cx(styles.filter, category === item.value && styles.filterActive)}>
            {item.label}
          </button>
        ))}
      </nav>

      <motion.div key={category} className={cx(styles.galleryGrid, category !== "all" && styles.galleryFiltered)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0.15 : 0.35, ease: EASE_CINEMA }}>
        {photos.map((photo, index) => (
          <button key={photo.id} type="button" onClick={() => setOpenIndex(index)} aria-label={`Xem ảnh: ${photo.title}`} aria-haspopup="dialog" className={cx(styles.galleryPhoto, category === "all" && index === 0 && styles.galleryFeatured)}>
            <Image src={photo.src} alt={photo.alt} fill sizes={category === "all" && index === 0 ? "(max-width: 1023px) 85vw, 50vw" : "(max-width: 1023px) 45vw, 33vw"} className={styles.galleryImage} />
            <span className={styles.photoShade} aria-hidden />
            <span className={styles.photoExpand} aria-hidden><Maximize2 size={16} strokeWidth={1.5} /></span>
            <span className={styles.photoCaption}>
              <span className="type-label text-accent">{galleryCategories.find(item => item.value === photo.category)?.label}</span>
              <span className={styles.photoTitle}>{photo.title}</span>
            </span>
          </button>
        ))}
      </motion.div>
      <p className={styles.galleryNote} aria-live="polite">{photos.length} khoảnh khắc · Chạm vào ảnh để xem trọn khung hình</p>
      <ImageLightbox images={photos} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </Section>
  );
}
