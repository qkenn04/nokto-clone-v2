import Link from "next/link";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * Typography and layout primitives mirroring the source design system.
 * Class strings are joined, not merged: tailwind-merge treats custom sizes such as
 * `text-h1` and colours such as `text-muted` as the same group and drops one.
 */
export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Responsive<T extends string | number> = T | Partial<Record<"base" | "sm" | "md" | "lg" | "xl" | "2xl", T>>;

function responsive<T extends string | number>(value: Responsive<T> | undefined, map: Record<T, string>) {
  if (value === undefined) return "";
  if (typeof value !== "object") return map[value];
  return (["base", "sm", "md", "lg", "xl", "2xl"] as const)
    .filter((bp) => value[bp] !== undefined)
    .map((bp) => (bp === "base" ? map[value[bp] as T] : `${bp}:${map[value[bp] as T]}`))
    .join(" ");
}

// Tailwind only generates classes it can see, so every responsive variant is spelled out.
const gapClasses = {
  0: "gap-0", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4", 5: "gap-5", 6: "gap-6", 8: "gap-8", 10: "gap-10",
  12: "gap-12", 14: "gap-14", 16: "gap-16", 20: "gap-20", 24: "gap-24", 28: "gap-28", 32: "gap-32", 36: "gap-36",
  40: "gap-40", 48: "gap-48",
} as const;
type Gap = keyof typeof gapClasses;
const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
} as const;
const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

/** Flex column/row with the source's gap scale. Responsive gaps: pass explicit classes via className. */
export function Stack({
  as: Tag = "div",
  direction = "col",
  gap = 4,
  align,
  justify,
  wrap = false,
  fullHeight = false,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  direction?: "col" | "row";
  gap?: Gap;
  align?: keyof typeof alignClasses;
  justify?: keyof typeof justifyClasses;
  wrap?: boolean;
  fullHeight?: boolean | "lg";
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">) {
  return (
    <Tag
      className={cx(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        gapClasses[gap],
        align && alignClasses[align],
        justify && justifyClasses[justify],
        wrap && "flex-wrap",
        fullHeight === true && "h-full",
        fullHeight === "lg" && "lg:h-full",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const sectionPadY = {
  none: "",
  default: "section-pad-y",
  sm: "section-pad-y-sm",
  lg: "section-pad-y-lg",
  "lg-tight": "section-pad-y-lg-tight",
  "lg-loose": "section-pad-y-lg-loose",
} as const;

const sectionMinH = {
  none: "",
  dvh: "min-h-dvh",
  screen: "min-h-screen",
  "60dvh": "min-h-[60dvh]",
  "80dvh": "min-h-[80dvh]",
  "90dvh": "min-h-[90dvh]",
  "100dvh": "min-h-[100dvh]",
} as const;

/** Full-width section with the source's responsive gutters (`section-pad`). */
export function Section({
  as: Tag = "section",
  padX = true,
  padY = "default",
  minH = "none",
  tone = "transparent",
  relative = false,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  padX?: boolean;
  padY?: keyof typeof sectionPadY;
  minH?: Responsive<keyof typeof sectionMinH>;
  tone?: "background" | "surface" | "transparent";
  relative?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "className" | "children">) {
  return (
    <Tag
      className={cx(
        "w-full",
        relative && "relative",
        padX && "section-pad",
        sectionPadY[padY],
        responsive(minH, sectionMinH),
        tone === "background" && "bg-background text-foreground",
        tone === "surface" && "bg-surface text-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const headingLevels = {
  display: "text-display leading-[var(--leading-display)] tracking-[-0.035em]",
  h1: "text-h1 leading-[var(--leading-tight)] tracking-[-0.03em]",
  h2: "text-h2 leading-[var(--leading-tight)] tracking-[-0.025em]",
  h3: "text-h3 leading-[var(--leading-tight)] tracking-[-0.02em]",
  category: "text-category-name leading-[var(--leading-tight)] tracking-[-0.015em]",
  closing: "text-closing leading-[var(--leading-none)]",
  stat: "text-stat leading-[var(--leading-tight)] tracking-[var(--tracking-display)]",
} as const;

/** Serif heading. `as` sets the element, `level` sets the visual size. */
export function Heading({
  as: Tag = "h2",
  level = "h2",
  family = "serif",
  italic = false,
  weight = "normal",
  tone = "default",
  balance = true,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  level?: keyof typeof headingLevels;
  family?: "sans" | "serif";
  italic?: boolean;
  weight?: "light" | "normal" | "medium";
  tone?: "default" | "muted" | "accent";
  balance?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"h2">, "className" | "children">) {
  return (
    <Tag
      className={cx(
        headingLevels[level],
        family === "serif" ? "font-serif" : "font-sans",
        tone === "default" ? "text-foreground" : tone === "muted" ? "text-muted" : "text-accent",
        weight === "light" ? "font-light" : weight === "medium" ? "font-medium" : "font-normal",
        italic && "italic",
        balance && "text-balance",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const textVariant = { editorial: "text-editorial", body: "text-body", small: "text-small", label: "type-label" } as const;
const textVariantLeading = {
  editorial: "leading-[var(--leading-narrow)]",
  body: "leading-[var(--leading-body)]",
  small: "leading-relaxed",
  label: "",
} as const;
const textVariantTracking = { editorial: "tracking-[-0.015em]", body: "", small: "", label: "" } as const;
const textTracking = {
  tight: "tracking-[var(--tracking-tight)]",
  narrow: "tracking-[-0.015em]",
  normal: "tracking-normal",
  label: "tracking-[var(--tracking-label)]",
} as const;
const textTone = {
  default: "text-foreground",
  soft: "text-foreground/85",
  faded: "text-foreground/80",
  low: "text-foreground/70",
  dim: "text-foreground/50",
  muted: "text-muted",
  subtle: "text-subtle",
  accent: "text-accent",
  "accent-80": "text-accent/80",
  "accent-70": "text-accent/70",
  "accent-60": "text-accent/60",
  error: "text-error",
} as const;
const textLeading = {
  tight: "leading-[var(--leading-tight)]",
  narrow: "leading-[var(--leading-narrow)]",
  snug: "leading-[var(--leading-snug)]",
  normal: "leading-[var(--leading-normal)]",
  body: "leading-[var(--leading-body)]",
  none: "leading-[var(--leading-none)]",
} as const;
const textWeight = { light: "font-light", normal: "font-normal", medium: "font-medium", semibold: "font-semibold" } as const;
const textMeasure = {
  tight: "max-w-[32ch]",
  reading: "max-w-[40ch]",
  comfort: "max-w-[44ch]",
  wide: "max-w-[64ch]",
  none: "",
} as const;

/** Body/label/editorial text. Serif text defaults to the light weight, as in the source. */
export function Text({
  as: Tag = "p",
  variant = "body",
  serif = false,
  italic = false,
  weight,
  tone = "default",
  leading,
  tracking,
  uppercase = false,
  balance = false,
  pretty = false,
  measure = "none",
  nowrap = false,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  variant?: keyof typeof textVariant;
  serif?: boolean;
  italic?: boolean;
  weight?: keyof typeof textWeight;
  tone?: keyof typeof textTone;
  leading?: keyof typeof textLeading;
  tracking?: keyof typeof textTracking;
  uppercase?: boolean;
  balance?: boolean;
  pretty?: boolean;
  measure?: keyof typeof textMeasure;
  nowrap?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"p">, "className" | "children">) {
  const resolvedWeight = weight ?? (serif ? "light" : undefined);
  return (
    <Tag
      className={cx(
        textVariant[variant],
        leading ? textLeading[leading] : textVariantLeading[variant],
        tracking ? textTracking[tracking] : textVariantTracking[variant],
        textTone[tone],
        serif && "font-serif",
        italic && "italic",
        resolvedWeight && textWeight[resolvedWeight],
        uppercase && variant !== "label" && "uppercase tracking-[var(--tracking-label)]",
        balance && "text-balance",
        pretty && "text-pretty",
        textMeasure[measure],
        nowrap && "whitespace-nowrap",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const buttonBase =
  "inline-flex items-center uppercase text-small tracking-[var(--tracking-label)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-[var(--duration-fast)] disabled:opacity-50 disabled:pointer-events-none";

const buttonVariants = {
  primary:
    "relative isolate overflow-hidden gap-3 px-6 py-3 bg-accent text-accent-foreground before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-foreground before:origin-left before:scale-x-0 before:transition-transform before:duration-500 before:ease-cinema hover:before:scale-x-100",
  link: "relative gap-2 items-baseline border-b border-foreground/30 pb-1 hover:text-accent after:content-[''] after:absolute after:left-0 after:-bottom-px after:h-px after:w-full after:bg-accent after:origin-left after:scale-x-0 after:transition-transform after:duration-500 after:ease-cinema hover:after:scale-x-100",
  ghost: "gap-2 text-foreground/80 hover:text-foreground",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

/** Class string for the source's three button styles; use on <button> or links. */
export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cx(buttonBase, buttonVariants[variant], className);
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: { href: string; variant?: ButtonVariant; className?: string; children: ReactNode } & Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href" | "className" | "children"
>) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}
