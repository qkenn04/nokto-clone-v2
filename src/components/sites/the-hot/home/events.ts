export type EventStatus = "upcoming" | "live" | "past";
export type EventFilter = "all" | EventStatus;
export type EventTiming =
  | { kind: "scheduled"; startsAt: string; endsAt: string; dateOnly?: boolean }
  | { kind: "announcement"; dateLabel: string };

export type HomeEvent = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  poster: string;
  posterAlt: string;
  tags: string[];
  timing: EventTiming;
  sourceHref?: string;
  illustrative?: boolean;
};

export const eventStatusLabels: Record<EventStatus, string> = {
  upcoming: "Sắp diễn ra",
  live: "Đang diễn ra",
  past: "Đã diễn ra",
};

/** Schedules use explicit UTC offsets, independent of the visitor's time zone. */
export function getEventStatus(event: HomeEvent, now: number): EventStatus | null {
  if (event.timing.kind !== "scheduled") return null;
  const start = Date.parse(event.timing.startsAt);
  const end = Date.parse(event.timing.endsAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  if (now < start) return "upcoming";
  if (now < end) return event.timing.dateOnly ? null : "live";
  return "past";
}

export function getEventDate(event: HomeEvent) {
  if (event.timing.kind === "announcement") return { label: event.timing.dateLabel, year: null };
  const date = new Date(event.timing.startsAt);
  if (!Number.isFinite(date.getTime())) return { label: "—", year: null };
  const options = { timeZone: "Asia/Ho_Chi_Minh" };
  const parts = new Intl.DateTimeFormat("vi-VN", { ...options, day: "2-digit", month: "2-digit" }).formatToParts(date);
  const day = parts.find(part => part.type === "day")?.value;
  const month = parts.find(part => part.type === "month")?.value;
  return {
    label: `${day}/${month}`,
    year: new Intl.DateTimeFormat("vi-VN", { ...options, year: "numeric" }).format(date),
  };
}

export function getEventTimeRange(event: HomeEvent): string | null {
  if (event.timing.kind !== "scheduled" || event.timing.dateOnly) return null;
  const start = new Date(event.timing.startsAt);
  const end = new Date(event.timing.endsAt);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return null;
  const timeZone = "Asia/Ho_Chi_Minh";
  const hours = new Intl.DateTimeFormat("vi-VN", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const day = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
  const overnight = day.format(start) !== day.format(end);
  return `${hours.format(start)} – ${hours.format(end)}${overnight ? " (hôm sau)" : ""}`;
}

export function filterEvents(events: HomeEvent[], filter: EventFilter, now: number | null) {
  return events
    .filter(event => filter === "all" || (now !== null && getEventStatus(event, now) === filter))
    .toSorted((a, b) => {
      if (a.timing.kind !== "scheduled") return b.timing.kind === "scheduled" ? 1 : 0;
      if (b.timing.kind !== "scheduled") return -1;
      const delta = Date.parse(a.timing.startsAt) - Date.parse(b.timing.startsAt);
      return filter === "upcoming" ? delta : -delta;
    });
}
