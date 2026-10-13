"use client";

import { ArrowUpRight, CalendarDays, Maximize2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { EASE_CINEMA } from "../../nokto/motion";
import { site } from "../../nokto/site";
import { ButtonLink, Heading, Section, Stack, Text, cx } from "../../nokto/ui";
import { homeEvents, recentEventsHref } from "./content";
import { eventStatusLabels, filterEvents, getEventDate, getEventStatus, getEventTimeRange, type EventFilter } from "./events";
import { ImageLightbox } from "./ImageLightbox";
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
  const minute = useSyncExternalStore(subscribeToClock, getClockSnapshot, getServerClockSnapshot);
  const now = minute === null ? null : minute * 60_000;
  const [active, setActive] = useState<EventFilter>("all");
  const [posterIndex, setPosterIndex] = useState<number | null>(null);
  const events = filterEvents(homeEvents, active, now);
  const posters = homeEvents.map(event => ({ src: event.poster, alt: event.posterAlt, title: event.title, caption: `${event.illustrative ? "Chương trình minh hoạ · " : ""}${event.subtitle}` }));

  return (
    <Section id="events" padY="lg-tight" tone="background" relative className={cx(styles.contentSection, styles.eventsSection)} aria-labelledby="home-events-title">
      <header className={styles.sectionHeader}>
        <Stack gap={4}>
          <Text variant="label" tone="accent">02 / Sự kiện</Text>
          <Heading as="h2" level="h1" id="home-events-title">Lịch lên mood.</Heading>
          <Text tone="muted" measure="comfort">Kèo cũ để nhớ. Kèo mới để hẹn. Mỗi đêm ở The Hot là một câu chuyện của hội mình.</Text>
        </Stack>
        <a href={recentEventsHref} target="_blank" rel="noreferrer" className={styles.textLink}>Lịch trên Facebook <ArrowUpRight aria-hidden size={16} /></a>
      </header>

      <nav className={styles.filters} aria-label="Lọc trạng thái sự kiện">
        {filters.map(filter => {
          const count = filterEvents(homeEvents, filter.value, now).length;
          return (
            <button key={filter.value} type="button" aria-pressed={active === filter.value} className={cx(styles.filter, active === filter.value && styles.filterActive)} onClick={() => setActive(filter.value)}>
              {filter.label}<span className={styles.filterCount} aria-hidden>{count}</span>
            </button>
          );
        })}
      </nav>

      <div aria-live="polite" className="sr-only">{events.length} sự kiện trong mục {filters.find(filter => filter.value === active)?.label}.</div>
      <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0.15 : 0.35, ease: EASE_CINEMA }}>
        {events.length > 0 ? (
          <ol className={styles.timeline}>
            {events.map(event => {
              const status = now === null ? null : getEventStatus(event, now);
              const date = getEventDate(event);
              const hours = getEventTimeRange(event);
              return (
                <li key={event.id} className={styles.timelineItem}>
                  <div className={styles.timelineDate}>
                    <span className={styles.timelineDot} aria-hidden />
                    {event.timing.kind === "scheduled" ? <time dateTime={event.timing.startsAt}>{date.label}</time> : <span>{date.label}</span>}
                    {date.year && <span className="type-label text-muted">{date.year}</span>}
                  </div>
                  <article className={styles.eventCard} aria-labelledby={`event-${event.id}`}>
                    <button type="button" className={styles.eventPoster} onClick={() => setPosterIndex(homeEvents.indexOf(event))} aria-label={`${event.illustrative ? "Xem ảnh sự kiện" : "Xem poster"}: ${event.title}`} aria-haspopup="dialog">
                      <Image src={event.poster} alt={event.posterAlt} fill sizes="(max-width: 639px) 80vw, (max-width: 1023px) 40vw, 320px" className="object-cover" />
                      <span className={styles.photoExpand} aria-hidden><Maximize2 size={16} strokeWidth={1.5} /></span>
                    </button>
                    <div className={styles.eventBody}>
                      <span className={cx(styles.eventStatus, status === "live" && styles.statusLive, status === "upcoming" && styles.statusUpcoming)}>
                        <span aria-hidden />{status ? eventStatusLabels[status] : "Thông báo sự kiện"}
                      </span>
                      {event.illustrative && <span className="type-label text-muted">Chương trình minh hoạ</span>}
                      <Heading as="h3" level="h2" id={`event-${event.id}`}>{event.title}</Heading>
                      <Text variant="label" tone="accent">{event.subtitle}</Text>
                      {hours && <Text variant="small" tone="muted">{hours} · Giờ Đà Lạt</Text>}
                      <Text tone="muted">{event.description}</Text>
                      <ul className={styles.eventTags} aria-label="Trong chương trình">{event.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
                      <div className={styles.eventActions}>
                        <button type="button" className={styles.textLink} onClick={() => setPosterIndex(homeEvents.indexOf(event))}>{event.illustrative ? "Xem ảnh" : "Xem poster"} <ArrowUpRight aria-hidden size={16} /></button>
                        {event.sourceHref && <a href={event.sourceHref} target="_blank" rel="noreferrer" className={styles.textLink}>Bài sự kiện <ArrowUpRight aria-hidden size={16} /></a>}
                        {(status === "live" || status === "upcoming") && <ButtonLink href={site.cta.href}>Chốt bàn</ButtonLink>}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className={styles.emptyState}>
            <CalendarDays aria-hidden size={30} strokeWidth={1.2} className="text-accent" />
            <Heading as="h3" level="h2">{emptyCopy[active].title}</Heading>
            <Text tone="muted" measure="comfort">{emptyCopy[active].body}</Text>
            <a href={site.socialHref} target="_blank" rel="noreferrer" className={styles.textLink}>Ghé Facebook The Hot <ArrowUpRight aria-hidden size={16} /></a>
          </div>
        )}
      </motion.div>

      <div className={styles.homeClosing}>
        <Stack gap={3}>
          <Text variant="label" tone="accent">Hẹn hội mình ở The Hot</Text>
          <Heading as="h2" level="closing">Kèo tối nay, chốt chưa?</Heading>
          <Text variant="small" tone="muted">{site.address.display} · {site.hours.display}</Text>
        </Stack>
        <ButtonLink href={site.cta.href} className="shrink-0 whitespace-nowrap">Chốt bàn cho hội mình</ButtonLink>
      </div>
      <ImageLightbox images={posters} index={posterIndex} onIndexChange={setPosterIndex} onClose={() => setPosterIndex(null)} />
    </Section>
  );
}
