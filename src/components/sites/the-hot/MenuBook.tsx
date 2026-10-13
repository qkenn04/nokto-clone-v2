"use client";

import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { MenuViewSwitcher } from "../nokto/menu/MenuViewSwitcher";
import { EASE_CINEMA } from "../nokto/motion";
import { site } from "../nokto/site";
import { ButtonLink, Heading, Section, Stack, Text, cx } from "../nokto/ui";
import styles from "./MenuBook.module.css";

const IMAGE_BASE = "/sites/the-hot-beer-garden/images/facebook-post-menu-2026-09";
const TURN_DURATION = 0.72;

const menuPages = [
  {
    file: "01-800796877_122135444649172686_9059122717537152863_n.jpg",
    label: "Món mới · trang 01",
    alt: "Menu món mới gồm bánh mì bơ tỏi, khoai lang kén, bắp sốt bơ cay và đậu hũ lướt ván",
  },
  {
    file: "02-800796866_122135444781172686_6041003405290942996_n.jpg",
    label: "Món mới · trang 02",
    alt: "Menu món mới gồm khoai lang kén lắc phô mai và da ếch rang muối",
  },
  {
    file: "03-799958838_122135444679172686_1250782695995952984_n.jpg",
    label: "Salad · trang 03",
    alt: "Menu salad dầu giấm, salad cải kale và khổ qua chà bông",
  },
  {
    file: "04-800993867_122135445015172686_2880443494216915679_n.jpg",
    label: "Gà · trang 04",
    alt: "Menu sụn gà rang muối và lòng mề gà xào hành",
  },
  {
    file: "05-800001194_122135444961172686_392697963960710615_n.jpg",
    label: "Mực · trang 05",
    alt: "Menu răng mực sốt bơ cay, răng mực chiên mắm và răng mực sate",
  },
  {
    file: "06-800756459_122135444985172686_4078762221086326244_n.jpg",
    label: "Hải sản · trang 06",
    alt: "Menu mực xào sate, mực trứng chiên mắm và mực trứng xào sate",
  },
  {
    file: "07-800862933_122135444823172686_5472107878615177399_n.jpg",
    label: "Heo · trang 07",
    alt: "Menu ba chỉ heo trộn thính, bao tử heo xào cải chua và bao tử heo chiên mắm",
  },
  {
    file: "08-800881809_122135444919172686_1741136367694887308_n.jpg",
    label: "Bò · trang 08",
    alt: "Menu gỏi bò Thái Lan và cải thìa xào bò sốt nấm",
  },
  {
    file: "09-800066853_122135444991172686_2171913459235762488_n.jpg",
    label: "Cơm và mì · trang 09",
    alt: "Menu mì trộn tứ vị, cơm chiên tóp mỡ, miến xào sốt XO và cơm chiên muối é",
  },
  {
    file: "10-792176893_122135446899172686_5106627020647185501_n.jpg",
    label: "Bia · trang 10",
    alt: "Menu bia gồm Heineken, Tiger, Larue và Strongbow",
  },
] as const;

type Direction = 1 | -1;

function clampIndex(index: number) {
  return Math.max(0, Math.min(menuPages.length - 1, index));
}

function PageSelect({ id, currentIndex, disabled, onChange }: {
  id: string;
  currentIndex: number;
  disabled: boolean;
  onChange: (index: number) => void;
}) {
  return (
    <div className={styles.pageSelect}>
      <label htmlFor={id} className="sr-only">Chọn trang menu</label>
      <select id={id} value={currentIndex} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))}>
        {menuPages.map((page, index) => <option key={page.file} value={index}>{page.label}</option>)}
      </select>
      <ChevronDown aria-hidden size={16} strokeWidth={1.5} />
    </div>
  );
}

export function MenuBook() {
  const reduce = useReducedMotion() ?? false;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [turn, setTurn] = useState<Direction | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const readerViewport = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const currentPage = menuPages[currentIndex];
  const targetPage = targetIndex === null ? null : menuPages[targetIndex];

  const goToPage = useCallback((index: number) => {
    if (turn !== null) return;
    const nextIndex = clampIndex(index);
    if (nextIndex === currentIndex) return;
    readerViewport.current?.scrollTo({ top: 0, left: 0 });
    if (reduce || dialogRef.current?.open) {
      setCurrentIndex(nextIndex);
      return;
    }
    setTargetIndex(nextIndex);
    setTurn(nextIndex > currentIndex ? 1 : -1);
  }, [currentIndex, reduce, turn]);

  const turnPage = (direction: Direction) => goToPage(currentIndex + direction);

  // Scope shortcuts to the reader so they never change pages while navigating the site.
  const handleReaderKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof HTMLElement && ["SELECT", "INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
    const index = event.key === "ArrowRight" ? currentIndex + 1
      : event.key === "ArrowLeft" ? currentIndex - 1
      : event.key === "Home" ? 0
      : event.key === "End" ? menuPages.length - 1
      : null;
    if (index === null) return;
    event.preventDefault();
    goToPage(index);
  };

  const previousButton = (
    <button type="button" className={styles.control} onClick={() => turnPage(-1)} disabled={currentIndex === 0 || turn !== null} aria-label="Trang trước">
      <ChevronLeft aria-hidden size={20} strokeWidth={1.5} />
    </button>
  );
  const nextButton = (
    <button type="button" className={styles.control} onClick={() => turnPage(1)} disabled={currentIndex === menuPages.length - 1 || turn !== null} aria-label="Trang sau">
      <ChevronRight aria-hidden size={20} strokeWidth={1.5} />
    </button>
  );

  return (
    <Section className={styles.menuPage} padY="none" relative aria-labelledby="hot-menu-title">
      <div className={styles.layout}>
        <motion.header className={styles.intro} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE_CINEMA }}>
          <Stack gap={4} className="sm:gap-6">
            <Text variant="label" tone="muted">Menu nhậu — The Hot</Text>
            <Heading as="h1" level="h1" id="hot-menu-title" balance={false}>
              <span className="block">Lật menu.</span>
              <span className="block text-accent">Chốt món.</span>
            </Heading>
            <Text variant="body" tone="muted" measure="comfort">Mồi bén, bia lạnh — đủ gu cho cả hội.</Text>
            <MenuViewSwitcher active="book" />
            <div className={styles.introNote}>
              <Text variant="small" tone="muted">Mồi từ 39K · Bia từ 19K*</Text>
              <ButtonLink href={site.cta.href} variant="link">Chốt bàn cho hội mình →</ButtonLink>
            </div>
          </Stack>
        </motion.header>

        <motion.div className={styles.bookArea} onKeyDown={handleReaderKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.15, ease: EASE_CINEMA }}>
          <div className={styles.toolbar}>
            <PageSelect id="menu-page" currentIndex={currentIndex} disabled={turn !== null} onChange={goToPage} />
            <button type="button" className={styles.expandButton} disabled={turn !== null} onClick={() => dialogRef.current?.showModal()} aria-label="Phóng lớn menu" aria-haspopup="dialog">
              <Maximize2 aria-hidden size={17} strokeWidth={1.5} />
              <span>Phóng lớn</span>
            </button>
          </div>

          <figure className={styles.bookShell}>
            <div
              className={styles.paperStage}
              role="region"
              aria-label="Menu ảnh lật sách"
              aria-describedby="menu-book-hint"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  turnPage(1);
                }
              }}
              onClick={(event) => {
                if (performance.now() < suppressClickUntil.current) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                turnPage(event.clientX - bounds.left > bounds.width / 2 ? 1 : -1);
              }}
              onPointerDown={(event) => {
                if (!event.isPrimary) return;
                pointerStart.current = { x: event.clientX, y: event.clientY };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerCancel={() => { pointerStart.current = null; }}
              onPointerUp={(event) => {
                const start = pointerStart.current;
                pointerStart.current = null;
                if (!start) return;
                const dx = event.clientX - start.x;
                const dy = event.clientY - start.y;
                if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
                suppressClickUntil.current = performance.now() + 350;
                turnPage(dx < 0 ? 1 : -1);
              }}
            >
              <div className={styles.paperBase}>
                <Image src={`${IMAGE_BASE}/${currentPage.file}`} alt={currentPage.alt} width={1414} height={2000} preload={currentIndex === 0} sizes="(max-width: 640px) calc(100vw - 64px), (max-width: 1024px) 45vw, 500px" className={styles.paperImage} />
              </div>
              {turn !== null && targetPage ? (
                <motion.div
                  key={`${currentIndex}-${turn}-${targetIndex}`}
                  className={styles.paperTurn}
                  style={{ transformOrigin: turn === 1 ? "left center" : "right center" }}
                  initial={{ rotateY: turn === 1 ? 92 : -92, opacity: 0.76 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: TURN_DURATION, ease: EASE_CINEMA }}
                  onAnimationComplete={() => {
                    if (targetIndex !== null) setCurrentIndex(targetIndex);
                    setTargetIndex(null);
                    setTurn(null);
                  }}
                >
                  <Image src={`${IMAGE_BASE}/${targetPage.file}`} alt="" width={1414} height={2000} sizes="(max-width: 640px) calc(100vw - 64px), (max-width: 1024px) 45vw, 500px" className={styles.paperImage} />
                </motion.div>
              ) : null}
            </div>
            <figcaption className={styles.bookCaption}>
              {previousButton}
              <span className={styles.pageStatus} aria-live="polite" aria-atomic="true">
                <span className={styles.captionTitle}>{currentPage.label.split(" · ")[0]}</span>
                <span className="type-label text-muted">{String(currentIndex + 1).padStart(2, "0")} / {String(menuPages.length).padStart(2, "0")}</span>
              </span>
              {nextButton}
            </figcaption>
          </figure>
          <div className={styles.progress} aria-hidden>
            {menuPages.map((page, index) => <span key={page.file} className={index <= currentIndex ? styles.progressRead : undefined} />)}
          </div>
          <p id="menu-book-hint" className={styles.hint}>
            Vuốt ngang hoặc chạm mép trang để lật.
            <span className="sr-only"> Dùng phím ← → khi chọn menu. Home về trang đầu, End đến trang cuối.</span>
          </p>
        </motion.div>
      </div>

      <div className={styles.closing}>
        <Stack gap={2}>
          <Text variant="small" tone="muted">Giá VNĐ, đã gồm VAT. * {site.beerOffer}</Text>
          <Text variant="small" tone="subtle">Món đang có và ưu đãi hôm bạn ghé? Nhắn The Hot để hỏi nhé.</Text>
        </Stack>
        <ButtonLink href={site.cta.href} className="shrink-0 whitespace-nowrap">Chốt bàn</ButtonLink>
      </div>

      <dialog ref={dialogRef} className={styles.readerDialog} aria-labelledby="menu-reader-title" onKeyDown={handleReaderKey} onClose={() => setZoomed(false)} data-lenis-prevent>
        <div className={styles.dialogLayout}>
          <header className={styles.dialogHeader}>
            <div>
              <p className="type-label text-muted">The Hot · Menu lật sách</p>
              <h2 id="menu-reader-title" className={styles.dialogTitle}>{currentPage.label.split(" · ")[0]}</h2>
            </div>
            <div className={styles.dialogActions}>
              <button type="button" className={styles.control} aria-label={zoomed ? "Thu nhỏ ảnh menu" : "Phóng to ảnh menu"} aria-pressed={zoomed} onClick={() => {
                setZoomed(!zoomed);
                readerViewport.current?.scrollTo({ top: 0, left: 0 });
              }}>
                {zoomed ? <ZoomOut aria-hidden size={20} /> : <ZoomIn aria-hidden size={20} />}
              </button>
              <button type="button" className={styles.control} aria-label="Đóng menu phóng lớn" onClick={() => dialogRef.current?.close()}>
                <X aria-hidden size={20} strokeWidth={1.5} />
              </button>
            </div>
          </header>
          <div ref={readerViewport} className={styles.readerViewport} data-lenis-prevent>
            <div className={cx(styles.readerCanvas, zoomed && styles.readerCanvasZoomed)}>
              <Image src={`${IMAGE_BASE}/${currentPage.file}`} alt={currentPage.alt} width={1414} height={2000} unoptimized className={styles.readerImage} />
            </div>
          </div>
          <footer className={styles.dialogFooter}>
            {previousButton}
            <PageSelect id="menu-page-fullscreen" currentIndex={currentIndex} disabled={turn !== null} onChange={goToPage} />
            {nextButton}
          </footer>
        </div>
      </dialog>
    </Section>
  );
}
