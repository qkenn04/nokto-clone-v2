"use client";

import { ArrowUpRight, CalendarDays, Headphones, Maximize2, Ticket } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { track, trackAttrs } from "@/lib/analytics";
import { EASE_CINEMA } from "../../nokto/motion";
import { site } from "../../nokto/site";
import { ButtonLink, Heading, Section, Text, cx } from "../../nokto/ui";
import { homeEvents, recentEventsHref } from "./content";
import { eventStatusLabels, filterEvents, getEventDate, getEventStatus, getEventTimeRange, type EventFilter } from "./events";
import { ImageLightbox } from "./ImageLightbox";
import { revealOnScroll } from "./motion";
import styles from "./HomeContent.module.css";

const filters: { value: EventFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "upcoming", label: "Sắp diễn ra" },
  { value: "live", label: "Đang diễn ra" },
  { value: "past", label: "Đã diễn ra" },
];

const emptyCopy: Record<EventFilter, { title: string; body: string }> = {
  all: { title: "Kèo mới đang lên lịch.", body: "Ghé Facebook The Hot để xem chương trình mới nhất và hẹn hội bạn." },
  upcoming: { title: "Kèo tiếp theo, hẹn sớm nhé.", body: "Lịch sắp tới sẽ có ở đây khi được công bố. Theo dõi Facebook The Hot để bắt kèo cùng hội mình." },
  live: { title: "Chưa có sự kiện đang diễn ra.", body: "Muốn biết tối nay ở The Hot có gì vui? Nhắn quán để hỏi lịch nhạc và chốt bàn." },
  past: { title: "Những đêm đáng nhớ.", body: "Các chương trình đã diễn ra sẽ được lưu lại ở đây. Ghé gallery để xem không khí The Hot." },
};

// Read the actual browser clock after hydration, then refresh once per minute.
// This keeps a static build from freezing event statuses on its build date.
function subscribeToClock(notify: () => void) {
  const timer = window.setInterval(notify, 60_000);
  const refresh = () => { if (document.visibilityState === "visible") notify(); };
  document.addEventListener("visibilitychange", refresh);
  return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
}
const getClockSnapshot = () => Math.floor(Date.now() / 60_000);
const getServerClockSnapshot = () => null;

export function EventTimeline() {
  const reduce = useReducedMotion() ?? false;
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 80%", "end 65%"] });
  const minute = useSyncExternalStore(subscribeToClock, getClockSnapshot, getServerClockSnapshot);
  const now = minute === null ? null : minute * 60_000;
  const [active, setActive] = useState<EventFilter>("all");
  const [posterIndex, setPosterIndex] = useState<number | null>(null);
  // Counts opening a poster, not paging through others inside the lightbox.
  const openPoster = (event: (typeof homeEvents)[number]) => {
    setPosterIndex(homeEvents.indexOf(event));
    track("event_view", { event_id: event.id });
  };
  const events = filterEvents(homeEvents, active, now);
  const posters = homeEvents.map(event => ({ src: event.poster, alt: event.posterAlt, title: event.title, caption: `${event.illustrative ? "Chương trình minh hoạ · " : ""}${event.subtitle}` }));

  return (
    <Section id="events" padY="lg-tight" tone="background" relative isolate className={cx(styles.contentSection, styles.eventsSection)} aria-labelledby="home-events-title">
      <motion.header {...revealOnScroll(reduce)} className={styles.sectionHeader}>
        <div className={styles.headerCopy}>
          <Text variant="label" tone="accent" className={styles.sectionLabel}><Ticket aria-hidden size={15} /> 02 / Đừng lỡ kèo vui</Text>
          <Heading as="h2" level="h1" id="home-events-title" className={styles.sectionTitle}>
            Lịch <span className={cx(styles.titleSticker, styles.titleStickerCoral)}>lên mood.</span>
          </Heading>
          <Text tone="muted" measure="comfort" className={styles.headerDescription}>Kèo cũ để nhớ. Kèo mới để hẹn. Mỗi đêm ở The Hot là một câu chuyện của hội mình.</Text>
        </div>
        <div className={styles.headerAside}>
          <div className={styles.soundBadge} aria-hidden="true">
            <Headphones size={22} strokeWidth={1.6} />
            <span className={styles.soundBars}>
              {[0, 1, 2, 3, 4].map(bar => <motion.span key={bar} initial={{ scaleY: 0.35 }} whileInView={{ scaleY: reduce ? 1 : [0.35, 1, 0.5, 0.85, 0.35] }} transition={{ duration: reduce ? 0 : 1.1 + bar * 0.15, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }} />)}
            </span>
            <span>Good music.<br />Great company.</span>
          </div>
          <a href={recentEventsHref} target="_blank" rel="noreferrer" className={styles.textLink} {...trackAttrs("social_click", { network: "facebook" })}>Lịch trên Facebook <ArrowUpRight aria-hidden size={18} /></a>
        </div>
      </motion.header>

      <motion.nav {...revealOnScroll(reduce, 0.06)} className={styles.filters} aria-label="Lọc trạng thái sự kiện">
        {filters.map(filter => {
          const count = filterEvents(homeEvents, filter.value, now).length;
          return (
            <button key={filter.value} type="button" aria-pressed={active === filter.value} className={cx(styles.filter, active === filter.value && styles.filterActive)} onClick={() => setActive(filter.value)}>
              {active === filter.value && <motion.span layoutId="event-filter" className={styles.filterIndicator} transition={{ duration: reduce ? 0 : 0.28, ease: EASE_CINEMA }} />}
              <span className={styles.filterLabel}>{filter.label}</span><span className={styles.filterCount} aria-hidden>{count}</span>
            </button>
          );
        })}
      </motion.nav>

      <div aria-live="polite" className="sr-only">{events.length} sự kiện trong mục {filters.find(filter => filter.value === active)?.label}.</div>
      <div ref={timelineRef} className={styles.timelineScene}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.16 }}>
            {events.length > 0 ? (
              <>
                <span className={styles.timelineRail} aria-hidden="true"><motion.span style={{ scaleY: reduce ? 1 : scrollYProgress }} className={styles.timelineProgress} /></span>
                <ol className={styles.timeline}>
                  {events.map((event, index) => {
                    const status = now === null ? null : getEventStatus(event, now);
                    const date = getEventDate(event);
                    const hours = getEventTimeRange(event);
                    return (
                      <motion.li key={event.id} {...revealOnScroll(reduce, 0.04, index % 2 === 0 ? 1 : -1)} className={styles.timelineItem}>
                        <div className={styles.timelineDate}>
                          <span className={styles.timelineDot} aria-hidden />
                          <span className={styles.dateTicket}>
                            {event.timing.kind === "scheduled" ? <time dateTime={event.timing.startsAt}>{date.label}</time> : <span>{date.label}</span>}
                            {date.year && <span>{date.year}</span>}
                          </span>
                        </div>
                        <motion.article whileHover={reduce ? undefined : { y: -5 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className={styles.eventCard} aria-labelledby={`event-${event.id}`}>
                          <button type="button" className={styles.eventPoster} onClick={() => openPoster(event)} aria-label={`${event.illustrative ? "Xem ảnh sự kiện" : "Xem poster"}: ${event.title}`} aria-haspopup="dialog">
                            <Image src={event.poster} alt={event.posterAlt} fill sizes="(max-width: 639px) 80vw, (max-width: 1023px) 40vw, 320px" className="object-cover" />
                            <span className={styles.photoExpand} aria-hidden><Maximize2 size={16} strokeWidth={1.5} /></span>
                          </button>
                          <div className={styles.eventBody}>
                            <div className={styles.eventTicketMeta} aria-hidden="true"><span>The Hot / Good times</span><span>No. {String(homeEvents.indexOf(event) + 1).padStart(3, "0")}</span></div>
                            <div className={styles.eventBadges}>
                              <span className={cx(styles.eventStatus, status === "live" && styles.statusLive, status === "upcoming" && styles.statusUpcoming)}>
                                <span aria-hidden />{status ? eventStatusLabels[status] : "Thông báo sự kiện"}
                              </span>
                              {event.illustrative && <span className="type-label text-muted">Chương trình minh hoạ</span>}
                            </div>
                            <Heading as="h3" level="h2" id={`event-${event.id}`} className={styles.eventTitle}>{event.title}</Heading>
                            <Text variant="label" tone="accent">{event.subtitle}</Text>
                            {hours && <Text variant="small" tone="muted">{hours} · Giờ Đà Lạt</Text>}
                            <Text tone="muted" className={styles.eventDescription}>{event.description}</Text>
                            <ul className={styles.eventTags} aria-label="Trong chương trình">{event.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
                            <div className={styles.eventActions}>
                              <button type="button" className={styles.textLink} onClick={() => openPoster(event)}>{event.illustrative ? "Xem ảnh" : "Xem poster"} <ArrowUpRight aria-hidden size={16} /></button>
                              {event.sourceHref && <a href={event.sourceHref} target="_blank" rel="noreferrer" className={styles.textLink} {...trackAttrs("social_click", { network: "facebook" })}>Bài sự kiện <ArrowUpRight aria-hidden size={16} /></a>}
                              {(status === "live" || status === "upcoming") && <ButtonLink href={site.cta.href} className={styles.eventBook} {...trackAttrs("booking_cta_click", { location: "event" })}>Chốt bàn <ArrowUpRight aria-hidden size={16} /></ButtonLink>}
                            </div>
                          </div>
                        </motion.article>
                      </motion.li>
                    );
                  })}
                </ol>
              </>
            ) : (
              <motion.div {...revealOnScroll(reduce)} className={styles.emptyState}>
                <CalendarDays aria-hidden size={30} strokeWidth={1.2} className="text-accent" />
                <Heading as="h3" level="h2">{emptyCopy[active].title}</Heading>
                <Text tone="muted" measure="comfort">{emptyCopy[active].body}</Text>
                <a href={site.socialHref} target="_blank" rel="noreferrer" className={styles.textLink} {...trackAttrs("contact_click", { method: "facebook", location: "event" })}>Ghé Facebook The Hot <ArrowUpRight aria-hidden size={16} /></a>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div initial={reduce ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.2 }} className={styles.homeClosing}>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : 28 },
            visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.65, ease: EASE_CINEMA } },
          }}
          className={styles.closingCopy}
        >
          <Text variant="label" className={styles.closingLabel}>Đặt bàn</Text>
          <motion.span
            aria-hidden="true"
            className={styles.closingRule}
            variants={{
              hidden: { scaleX: reduce ? 1 : 0 },
              visible: { scaleX: 1, transition: { duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.2, ease: EASE_CINEMA } },
            }}
          />
          <Heading as="h2" level="closing" className={styles.closingTitle}>Tối nay gặp nhau<br /><span>ở The Hot?</span></Heading>
          <Text variant="small" className={styles.closingNote}>Chọn giờ, chốt bàn, kéo hội mình tới.</Text>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : 20 },
            visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.2, ease: EASE_CINEMA } },
          }}
          className={styles.closingAction}
        >
          <motion.div
            className={styles.closingButtonWrap}
            whileHover={reduce ? undefined : { x: 6 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <ButtonLink href={site.cta.href} className={styles.closingButton} {...trackAttrs("booking_cta_click", { location: "closing" })}>Chốt bàn <ArrowUpRight aria-hidden size={20} /></ButtonLink>
          </motion.div>
        </motion.div>
      </motion.div>
      <ImageLightbox images={posters} index={posterIndex} onIndexChange={setPosterIndex} onClose={() => setPosterIndex(null)} />
    </Section>
  );
}
