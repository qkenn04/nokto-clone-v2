"use client";

import { ArrowUpRight, Camera, Maximize2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { EASE_CINEMA } from "../../nokto/motion";
import { Heading, Section, Text, cx } from "../../nokto/ui";
import { galleryCategories, galleryPhotos, type GalleryCategory } from "./content";
import { ImageLightbox } from "./ImageLightbox";
import { MoodStamp } from "./MoodStamp";
import { revealOnScroll } from "./motion";
import styles from "./HomeContent.module.css";

export function HomeGallery() {
  const reduce = useReducedMotion() ?? false;
  const [category, setCategory] = useState<GalleryCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const photos = galleryPhotos.filter(photo => category === "all" || photo.category === category);

  return (
    <Section id="gallery" padY="lg-tight" tone="background" relative isolate className={cx(styles.contentSection, styles.gallerySection)} aria-labelledby="home-gallery-title">
      <motion.header {...revealOnScroll(reduce)} className={styles.sectionHeader}>
        <div className={styles.headerCopy}>
          <Text variant="label" tone="accent" className={styles.sectionLabel}><Camera aria-hidden size={14} /> 01 / Gallery của hội mình</Text>
          <Heading as="h2" level="h1" id="home-gallery-title" className={styles.sectionTitle}>
            Hội mình <span className={styles.titleSticker}>ở đây.</span>
          </Heading>
          <Text tone="muted" measure="comfort" className={styles.headerDescription}>Nhạc lên, mồi lên bàn, hội bạn lên mood. Nhìn một vòng The Hot trước khi chốt kèo.</Text>
        </div>
        <div className={styles.headerAside}>
          <MoodStamp />
          <a href="#events" className={styles.textLink}>Xem lịch lên mood <ArrowUpRight aria-hidden size={18} /></a>
        </div>
      </motion.header>

      <motion.nav {...revealOnScroll(reduce, 0.06)} className={styles.filters} aria-label="Lọc ảnh gallery">
        {galleryCategories.map(item => (
          <button key={item.value} type="button" onClick={() => setCategory(item.value)} aria-pressed={category === item.value} className={cx(styles.filter, category === item.value && styles.filterActive)}>
            {category === item.value && <motion.span layoutId="gallery-filter" className={styles.filterIndicator} transition={{ duration: reduce ? 0 : 0.28, ease: EASE_CINEMA }} />}
            <span className={styles.filterLabel}>{item.label}</span>
          </button>
        ))}
      </motion.nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={category} className={cx(styles.galleryGrid, category !== "all" && styles.galleryFiltered)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.16 }}>
          {photos.map((photo, index) => (
            <motion.div key={photo.id} {...revealOnScroll(reduce, index * 0.07, index % 2 === 0 ? -3 : 3)} className={cx(styles.galleryFrame, category === "all" && index === 0 && styles.galleryFeatured)}>
              <button type="button" onClick={() => setOpenIndex(index)} aria-label={`Xem ảnh: ${photo.title}`} aria-haspopup="dialog" className={styles.galleryPhoto}>
                <span className={styles.photoWindow}>
                  <Image src={photo.src} alt={photo.alt} fill sizes={category === "all" && index === 0 ? "(max-width: 1023px) 85vw, 50vw" : "(max-width: 1023px) 45vw, 33vw"} className={styles.galleryImage} />
                  <span className={styles.photoShade} aria-hidden />
                  <span className={styles.photoExpand} aria-hidden><Maximize2 size={16} strokeWidth={1.5} /></span>
                  {category === "all" && index === 0 && <span className={styles.photoSticker} aria-hidden>Đêm nay<br />phải vui!</span>}
                </span>
                <span className={styles.photoCaption}>
                  <span className={styles.photoCategory}>{galleryCategories.find(item => item.value === photo.category)?.label}</span>
                  <span className={styles.photoTitle}>{photo.title}</span>
                  <span className={styles.photoNumber} aria-hidden>{String(galleryPhotos.indexOf(photo) + 1).padStart(2, "0")}</span>
                </span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {/* <p className={styles.galleryNote} aria-live="polite">{photos.length} khoảnh khắc · Chạm vào ảnh để xem trọn khung hình</p> */}
      <ImageLightbox images={photos} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </Section>
  );
}
