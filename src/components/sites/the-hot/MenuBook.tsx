"use client";

import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import {
  animate,
  cancelFrame,
  frame,
  motion,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
  type ValueAnimationTransition,
} from "motion/react";
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { MenuViewSwitcher } from "../nokto/menu/MenuViewSwitcher";
import { EASE_CINEMA } from "../nokto/motion";
import { site } from "../nokto/site";
import { ButtonLink, Heading, Section, Stack, Text, cx } from "../nokto/ui";
import styles from "./MenuBook.module.css";
import { clamp01, foldGradientCss, foldLeaf, liftAt, mirrorCss, polygonCss, type Corner } from "./menuBookFold";

const IMAGE_BASE = "/sites/the-hot-beer-garden/images/facebook-post-menu-2026-09";
const PAGE_SIZES = "(max-width: 640px) calc(100vw - 64px), (max-width: 1024px) 45vw, 500px";

// Leaf turns in seconds: on its own, with more turns queued behind it, and the last of a chain.
const TURN_SOLO = 0.84;
const TURN_QUEUED = 0.42;
const TURN_LANDING = 0.62;
// The leaf lifts off at once, sweeps across, then glides down onto the stack.
const EASE_TURN = [0.36, 0.18, 0.2, 1] as const;
// Queued turns riffle at an even pace so one leaf hands over to the next without a pause.
const EASE_RIFFLE = [0.2, 0.3, 0.6, 0.9] as const;
const EASE_GLIDE = [0.22, 0.7, 0.26, 1] as const;
const SPRING_RELEASE: ValueAnimationTransition<number> = { type: "spring", visualDuration: 0.5, bounce: 0 };
const SPRING_PEEK: ValueAnimationTransition<number> = { type: "spring", stiffness: 280, damping: 30 };

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

const LAST_PAGE = menuPages.length - 1;

type Direction = 1 | -1;
type Goal = "to" | "from";

/** A leaf in motion. Owned by the turn controller through a ref; React only renders its page pair. */
type Turn = {
  from: number;
  to: number;
  dir: Direction;
  corner: Corner;
  mode: "auto" | "drag" | "peek";
  started: boolean;
  heading: Goal;
  chained: boolean;
};

type View = { page: number; turn: { from: number; to: number } | null };

type Drag = {
  pointerId: number;
  startX: number;
  startY: number;
  width: number;
  height: number;
  top: number;
  samples: { x: number; time: number }[];
  turn: Turn | null;
  holdX: number;
  holdY: number;
  holdProgress: number;
  holdLift: number;
};

function clampIndex(index: number) {
  return Math.max(0, Math.min(LAST_PAGE, index));
}

function pageSrc(index: number) {
  return `${IMAGE_BASE}/${menuPages[index].file}`;
}

/** Resolves once the image has loaded and decoded, so a leaf never turns onto an empty page. */
function whenDecoded(image: HTMLImageElement) {
  const loaded = image.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      });
  return loaded.then(() => image.decode()).catch(() => undefined);
}

/** Horizontal pointer speed over the last 100ms, in px per ms. */
function releaseVelocity(samples: Drag["samples"]) {
  const last = samples[samples.length - 1];
  const first = samples.find((sample) => last.time - sample.time <= 100) ?? last;
  const elapsed = last.time - first.time;
  return elapsed > 0 ? (last.x - first.x) / elapsed : 0;
}

/** The edges of the leaves still to turn peek out beside the page, thinning as the reader goes on. */
function stackShadow(leaves: number) {
  const edges = Array.from({ length: Math.min(3, Math.ceil(leaves / 3)) }, (_, i) => {
    const step = i + 1;
    return `${2 * step - 1}px ${step}px 0 rgb(9 9 11), ${2 * step}px ${step}px 0 #d6cfc2`;
  });
  return [...edges, "0 1.5rem 3rem rgb(0 0 0 / 0.25)"].join(", ");
}

function PageSelect({ id, currentIndex, onChange }: {
  id: string;
  currentIndex: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className={styles.pageSelect}>
      <label htmlFor={id} className="sr-only">Chọn trang menu</label>
      <select id={id} value={currentIndex} onChange={(event) => onChange(Number(event.target.value))}>
        {menuPages.map((page, index) => <option key={page.file} value={index}>{page.label}</option>)}
      </select>
      <ChevronDown aria-hidden size={16} strokeWidth={1.5} />
    </div>
  );
}

export function MenuBook() {
  const reduce = useReducedMotion() ?? false;
  const [view, setView] = useState<View>({ page: 0, turn: null });
  const [target, setTarget] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const readerViewport = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheetsRef = useRef(new Map<number, HTMLDivElement>());
  const underShadowRef = useRef<HTMLDivElement>(null);
  const flapWrapRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const flapShadeRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  // The turn controller keeps its state in refs so animation callbacks never act on a stale render.
  const pageRef = useRef(0);
  const targetRef = useRef(0);
  const jumpRef = useRef(false);
  const turnRef = useRef<Turn | null>(null);
  const chainRef = useRef(false);
  const awaitingCommitRef = useRef(false);
  const settleIdRef = useRef(0);
  const leafAnimationsRef = useRef<AnimationPlaybackControls[]>([]);
  const dragRef = useRef<Drag | null>(null);
  const suppressClickUntil = useRef(0);
  const progress = useMotionValue(0);
  const liftOffset = useMotionValue(0);

  const { page, turn: turnPages } = view;
  const leafIndex = turnPages ? Math.min(turnPages.from, turnPages.to) : page;
  const underIndex = turnPages ? Math.max(turnPages.from, turnPages.to) : null;
  const sheetPages = [...new Set([page - 1, page, page + 1, leafIndex, underIndex ?? -1])]
    .filter((index) => index >= 0 && index <= LAST_PAGE)
    .sort((a, b) => a - b);
  const preloadPages = [...new Set([page - 2, page + 2, target - 1, target, target + 1])]
    .filter((index) => index >= 0 && index <= LAST_PAGE && !sheetPages.includes(index));
  const shownPage = menuPages[target];

  /** Draws the current fold: clips the leaf, mirrors its back over the fold, and moves the shading with it. */
  const paint = () => {
    const flapWrap = flapWrapRef.current;
    const flap = flapRef.current;
    const flapShade = flapShadeRef.current;
    const underShadow = underShadowRef.current;
    if (awaitingCommitRef.current || !flapWrap || !flap || !flapShade || !underShadow) return;
    const turn = turnRef.current;
    const leaf = turn ? sheetsRef.current.get(turn.dir === 1 ? turn.from : turn.to) : undefined;
    const { width, height } = sizeRef.current;
    const t = clamp01(progress.get());
    const fold = turn && leaf && width > 0 ? foldLeaf(width, height, t, liftAt(t) + liftOffset.get(), turn.corner) : null;
    if (!leaf || !fold) {
      if (leaf) leaf.style.clipPath = "";
      flapWrap.style.visibility = "hidden";
      underShadow.style.visibility = "hidden";
      return;
    }

    const into = { x: -fold.normal.x, y: -fold.normal.y };
    const presence = Math.min(1, Math.sin(Math.PI * t) * 2.2);
    const curl = Math.min(Math.max(fold.depth * 0.42, 6), width * 0.3);
    const reach = Math.min(Math.max(fold.depth * 0.5, 10), width * 0.36);
    const shade = (alpha: number) => `rgb(0 0 0 / ${(alpha * presence).toFixed(3)})`;

    leaf.style.clipPath = polygonCss(fold.front);
    flap.style.clipPath = polygonCss(fold.flap);
    flap.style.transform = mirrorCss(fold.origin, fold.normal);
    // The back of the leaf: shaded where the paper rolls away at the crease, lit along the curl, then flat.
    flapShade.style.backgroundImage = foldGradientCss(width, height, fold.origin, into, [
      ["rgb(58 42 24 / 0.3)", 0],
      ["rgb(58 42 24 / 0.08)", curl * 0.16],
      ["rgb(255 252 245 / 0.5)", curl * 0.45],
      ["rgb(255 252 245 / 0.08)", curl * 0.85],
      ["rgb(255 252 245 / 0)", curl],
      ["rgb(58 42 24 / 0.12)", fold.depth],
    ]);
    // The lifted leaf shades the page it uncovers, darkest tight against the crease.
    underShadow.style.backgroundImage = foldGradientCss(width, height, fold.origin, into, [
      [shade(0.55), 0],
      [shade(0.24), reach * 0.2],
      [shade(0.07), reach],
      [shade(0.03), reach + width * 0.6],
    ]);
    flapWrap.style.filter = `drop-shadow(0 ${(2 * presence).toFixed(2)}px ${(3 + 10 * presence).toFixed(2)}px ${shade(0.4)})`;
    flapWrap.style.visibility = "visible";
    underShadow.style.visibility = "visible";
  };

  const publish = () => {
    // Hold painting until React has placed the new page pair; the last painted frame stays on screen meanwhile.
    awaitingCommitRef.current = true;
    const turn = turnRef.current;
    setView({ page: pageRef.current, turn: turn && { from: turn.from, to: turn.to } });
  };

  const stopLeaf = () => {
    settleIdRef.current += 1;
    progress.stop();
    liftOffset.stop();
  };

  const beginTurn = (from: number, to: number, mode: Turn["mode"], corner: Corner) => {
    const dir: Direction = to > from ? 1 : -1;
    const turn: Turn = {
      from,
      to,
      dir,
      corner,
      mode,
      started: false,
      heading: "to",
      chained: chainRef.current,
    };
    stopLeaf();
    turnRef.current = turn;
    awaitingCommitRef.current = true;
    progress.jump(dir === 1 ? 0 : 1);
    liftOffset.jump(0);
    publish();
    return turn;
  };

  const finishTurn = (turn: Turn, landed: Goal) => {
    if (turnRef.current !== turn) return;
    pageRef.current = landed === "to" ? turn.to : turn.from;
    turnRef.current = null;
    chainRef.current = true;
    advance();
    chainRef.current = false;
    publish();
  };

  const settle = (turn: Turn, goal: Goal, transition: ValueAnimationTransition<number>) => {
    const id = ++settleIdRef.current;
    turn.started = true;
    turn.heading = goal;
    const end = (goal === "to") === (turn.dir === 1) ? 1 : 0;
    const animations = [animate(progress, end, transition), animate(liftOffset, 0, transition)];
    leafAnimationsRef.current = animations;
    Promise.all(animations).then(() => {
      if (settleIdRef.current === id) finishTurn(turn, goal);
    });
  };

  /** Finishes a leaf already in motion from wherever it is, at the pace of a full turn. */
  const glide = (turn: Turn, goal: Goal) => {
    const end = (goal === "to") === (turn.dir === 1) ? 1 : 0;
    const share = Math.abs(end - clamp01(progress.get()));
    settle(turn, goal, { duration: Math.max(0.24, TURN_SOLO * share), ease: EASE_GLIDE });
  };

  /** Steers the leaf toward the requested page: starts, reverses, hurries or chains turns. */
  const advance = () => {
    const goal = targetRef.current;
    const turn = turnRef.current;
    if (!turn) {
      const from = pageRef.current;
      if (goal === from) return;
      beginTurn(from, jumpRef.current ? goal : from + (goal > from ? 1 : -1), "auto", "bottom");
      return;
    }
    if (turn.mode === "drag") return;
    const onward = Math.sign(goal - turn.from) === turn.dir;
    if (turn.mode === "peek") {
      turn.mode = "auto";
      glide(turn, onward ? "to" : "from");
      return;
    }
    if (!turn.started) {
      if (!onward) {
        turnRef.current = null;
        publish();
        advance();
      }
      return;
    }
    if (onward !== (turn.heading === "to")) glide(turn, onward ? "to" : "from");
    else if (onward && goal !== turn.to) leafAnimationsRef.current.forEach((animation) => { animation.speed = 1.8; });
  };

  const playWhenReady = (turn: Turn) => {
    const images = [turn.from, turn.to].map((index) => sheetsRef.current.get(index)?.querySelector("img"));
    images.push(flapRef.current?.querySelector("img"));
    const ready = Promise.all(images.map((image) => (image ? whenDecoded(image) : undefined)));
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 6000));
    Promise.race([ready, timeout]).then(() => {
      if (turnRef.current !== turn || turn.started) return;
      const queued = !jumpRef.current && Math.abs(targetRef.current - turn.from) > 1;
      settle(turn, "to", queued
        ? { duration: TURN_QUEUED, ease: EASE_RIFFLE }
        : { duration: turn.chained ? TURN_LANDING : TURN_SOLO, ease: EASE_TURN });
    });
  };

  const commitInstant = (index: number) => {
    stopLeaf();
    dragRef.current = null;
    turnRef.current = null;
    pageRef.current = index;
    progress.jump(0);
    liftOffset.jump(0);
    publish();
  };

  const requestPage = (index: number, jump: boolean) => {
    const goal = clampIndex(index);
    if (goal === targetRef.current) return;
    targetRef.current = goal;
    jumpRef.current = jump;
    setTarget(goal);
    readerViewport.current?.scrollTo({ top: 0, left: 0 });
    if (reduce || dialogRef.current?.open) commitInstant(goal);
    else advance();
  };

  const requestStep = (direction: Direction) => requestPage(targetRef.current + direction, false);

  /** On hover-capable pointers, the corner nearest the cursor lifts a little to show the page can turn. */
  const peek = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse" || event.buttons !== 0) return;
    const current = turnRef.current;
    if (current && current.mode !== "peek") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const { width, height } = bounds;
    const reach = width * 0.32;
    const toNext = Math.hypot(width - x, height - y);
    const toPrev = Math.hypot(x, height - y);
    const dir: Direction | null = pageRef.current < LAST_PAGE && toNext < reach ? 1 : pageRef.current > 0 && toPrev < reach ? -1 : null;
    if (current && dir !== current.dir) {
      if (current.heading !== "from") settle(current, "from", SPRING_PEEK);
      return;
    }
    if (dir === null) return;
    // Going back, the top corner geometry keeps the sliver widest at the bottom, under the cursor.
    const turn = current ?? beginTurn(pageRef.current, pageRef.current + dir, "peek", dir === 1 ? "bottom" : "top");
    settleIdRef.current += 1;
    turn.heading = "to";
    let pose: { progress: number; lift: number };
    if (dir === 1) {
      // The corner leans toward the cursor, lifted at least a little so it always reads as a corner.
      const length = Math.max(toNext, 1);
      const peel = Math.min(Math.max(toNext * 0.6 + width * 0.08, width * 0.1), width * 0.22);
      const cornerX = width + ((x - width) / length) * peel;
      const cornerY = height + ((y - height) / length) * peel - height * 0.03;
      const at = (width - cornerX) / (2 * width);
      pose = { progress: at, lift: (height - cornerY) / height - liftAt(at) };
    } else {
      const closeness = clamp01(1 - toPrev / reach);
      pose = { progress: 1 - (0.035 + 0.04 * closeness), lift: 0.1 + 0.08 * closeness };
    }
    animate(progress, pose.progress, SPRING_PEEK);
    animate(liftOffset, pose.lift, SPRING_PEEK);
  };

  const closePeek = () => {
    const turn = turnRef.current;
    if (turn?.mode === "peek" && turn.heading !== "from") settle(turn, "from", SPRING_PEEK);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      width: bounds.width,
      height: bounds.height,
      top: bounds.top,
      samples: [{ x: event.clientX, time: event.timeStamp }],
      turn: null,
      holdX: 0,
      holdY: 0,
      holdProgress: 0,
      holdLift: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      peek(event);
      return;
    }
    if (drag.pointerId !== event.pointerId) return;
    drag.samples.push({ x: event.clientX, time: event.timeStamp });
    if (drag.samples.length > 8) drag.samples.shift();

    if (!drag.turn) {
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (reduce || Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      const current = turnRef.current;
      // A turn already under way keeps going; this gesture then counts as a swipe on release.
      if (current && current.mode !== "peek") return;
      const dir: Direction = dx < 0 ? 1 : -1;
      const from = pageRef.current;
      if (from + dir < 0 || from + dir > LAST_PAGE) return;
      const corner: Corner = drag.startY - drag.top < drag.height / 2 ? "top" : "bottom";
      const turn = current && current.dir === dir ? current : beginTurn(from, from + dir, "drag", corner);
      stopLeaf();
      turn.mode = "drag";
      drag.turn = turn;
      drag.holdX = event.clientX;
      drag.holdY = event.clientY;
      drag.holdProgress = progress.get();
      drag.holdLift = liftOffset.get();
    }

    // Turning forward, the corner runs a little ahead of the finger; turning back, the crease stays under it.
    const { turn } = drag;
    const along = (event.clientX - drag.holdX) / drag.width;
    const rise = (event.clientY - drag.holdY) / drag.height;
    progress.set(clamp01(drag.holdProgress - along * (turn.dir === 1 ? 0.7 : 1)));
    liftOffset.set(drag.holdLift + (turn.corner === "bottom" ? -rise : rise) * 0.45);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    drag.samples.push({ x: event.clientX, time: event.timeStamp });

    const { turn } = drag;
    if (turn) {
      suppressClickUntil.current = performance.now() + 400;
      const toward = releaseVelocity(drag.samples) * -turn.dir;
      // Finish past roughly a third of the page width, or on a flick; otherwise the leaf falls back.
      const travelled = ((event.clientX - drag.holdX) / drag.width) * -turn.dir;
      const finish = toward > 0.4 || (travelled > 0.34 && toward > -0.2);
      turn.mode = "auto";
      if (finish && targetRef.current === turn.from) {
        targetRef.current = turn.to;
        jumpRef.current = false;
        setTarget(turn.to);
      }
      settle(turn, finish ? "to" : "from", SPRING_RELEASE);
      return;
    }

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    suppressClickUntil.current = performance.now() + 350;
    requestStep(dx < 0 ? 1 : -1);
  };

  const handlePointerCancel = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.turn) return;
    drag.turn.mode = "auto";
    settle(drag.turn, "from", SPRING_RELEASE);
  };

  // Scope shortcuts to the reader so they never change pages while navigating the site.
  const handleReaderKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof HTMLElement && ["SELECT", "INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      requestStep(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      requestPage(event.key === "Home" ? 0 : LAST_PAGE, true);
    }
  };

  const openReader = () => {
    if (turnRef.current || pageRef.current !== targetRef.current) commitInstant(targetRef.current);
    dialogRef.current?.showModal();
  };

  const onPaint = useEffectEvent(() => paint());

  const onViewCommit = useEffectEvent(() => {
    sheetsRef.current.forEach((sheet) => {
      sheet.style.clipPath = "";
    });
    awaitingCommitRef.current = false;
    paint();
    const turn = turnRef.current;
    if (turn && turn.mode === "auto" && !turn.started) playWhenReady(turn);
  });

  useLayoutEffect(() => {
    onViewCommit();
  }, [view]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      sizeRef.current = { width: stage.clientWidth, height: stage.clientHeight };
      onPaint();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // One paint per frame however many values changed in it.
    const paintFrame = () => onPaint();
    const schedule = () => frame.render(paintFrame);
    const stopProgress = progress.on("change", schedule);
    const stopLift = liftOffset.on("change", schedule);
    return () => {
      stopProgress();
      stopLift();
      cancelFrame(paintFrame);
    };
  }, [progress, liftOffset]);

  const previousButton = (
    <button type="button" className={styles.control} onClick={() => requestStep(-1)} disabled={target === 0} aria-label="Trang trước">
      <ChevronLeft aria-hidden size={20} strokeWidth={1.5} />
    </button>
  );
  const nextButton = (
    <button type="button" className={styles.control} onClick={() => requestStep(1)} disabled={target === LAST_PAGE} aria-label="Trang sau">
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
            <PageSelect id="menu-page" currentIndex={target} onChange={(index) => requestPage(index, true)} />
            <button type="button" className={styles.expandButton} onClick={openReader} aria-label="Phóng lớn menu" aria-haspopup="dialog">
              <Maximize2 aria-hidden size={17} strokeWidth={1.5} />
              <span>Phóng lớn</span>
            </button>
          </div>

          <figure className={styles.bookShell}>
            <div
              ref={stageRef}
              className={styles.paperStage}
              style={{ boxShadow: stackShadow(LAST_PAGE - page) }}
              role="region"
              aria-label="Menu ảnh lật sách"
              aria-describedby="menu-book-hint"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  requestStep(1);
                }
              }}
              onClick={(event) => {
                if (performance.now() < suppressClickUntil.current) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                requestStep(event.clientX - bounds.left > bounds.width / 2 ? 1 : -1);
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse" && !dragRef.current) closePeek();
              }}
            >
              {sheetPages.map((index) => (
                <div
                  key={menuPages[index].file}
                  ref={(node) => {
                    if (node) sheetsRef.current.set(index, node);
                    return () => {
                      sheetsRef.current.delete(index);
                    };
                  }}
                  className={styles.sheet}
                  style={{ zIndex: index === leafIndex ? 4 : index === underIndex ? 2 : 1 }}
                  aria-hidden={index === page ? undefined : true}
                >
                  <Image
                    src={pageSrc(index)}
                    alt={index === page ? menuPages[index].alt : ""}
                    width={1414}
                    height={2000}
                    sizes={PAGE_SIZES}
                    preload={index === 0}
                    loading={index === 0 ? undefined : "eager"}
                    draggable={false}
                    className={styles.paperImage}
                  />
                </div>
              ))}
              <div ref={underShadowRef} className={styles.underShadow} aria-hidden />
              <div ref={flapWrapRef} className={styles.flapWrap} aria-hidden>
                <div ref={flapRef} className={styles.flap}>
                  {turnPages ? (
                    <Image key={menuPages[leafIndex].file} src={pageSrc(leafIndex)} alt="" width={1414} height={2000} sizes={PAGE_SIZES} loading="eager" draggable={false} className={styles.flapPrint} />
                  ) : null}
                  <div ref={flapShadeRef} className={styles.flapShade} />
                </div>
              </div>
              <span className={styles.gutter} aria-hidden />
            </div>
            <div className={styles.preload} aria-hidden>
              {preloadPages.map((index) => (
                <Image key={menuPages[index].file} src={pageSrc(index)} alt="" width={1414} height={2000} sizes={PAGE_SIZES} loading="eager" />
              ))}
            </div>
            <figcaption className={styles.bookCaption}>
              {previousButton}
              <span className={styles.pageStatus} aria-live="polite" aria-atomic="true">
                <span className={styles.captionTitle}>{shownPage.label.split(" · ")[0]}</span>
                <span className="type-label text-muted">{String(target + 1).padStart(2, "0")} / {String(menuPages.length).padStart(2, "0")}</span>
              </span>
              {nextButton}
            </figcaption>
          </figure>
          <div className={styles.progress} aria-hidden>
            {menuPages.map((menuPage, index) => <span key={menuPage.file} className={index <= target ? styles.progressRead : undefined} />)}
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
              <h2 id="menu-reader-title" className={styles.dialogTitle}>{shownPage.label.split(" · ")[0]}</h2>
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
              <Image src={pageSrc(target)} alt={shownPage.alt} width={1414} height={2000} unoptimized className={styles.readerImage} />
            </div>
          </div>
          <footer className={styles.dialogFooter}>
            {previousButton}
            <PageSelect id="menu-page-fullscreen" currentIndex={target} onChange={(index) => requestPage(index, true)} />
            {nextButton}
          </footer>
        </div>
      </dialog>
    </Section>
  );
}
