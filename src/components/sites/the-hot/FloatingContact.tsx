"use client";

import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { site } from "../nokto/site";
import styles from "./FloatingContact.module.css";

const contactItems = [
  { label: "Messenger", href: site.messengerHref, icon: MessageCircle, className: styles.messenger },
  { label: "Facebook", href: site.socialHref, icon: null, className: styles.facebook },
  { label: "Zalo", href: site.zaloHref, icon: null, className: styles.zalo },
  { label: "Gọi The Hot", href: site.phoneHref, icon: Phone, className: styles.phone },
] as const;

/** Fixed reservation CTA and quick contact bubbles for the restaurant's most useful channels. */
export function FloatingContact() {
  const reduce = useReducedMotion() ?? false;

  return (
    <aside className={styles.shell} aria-label="Liên hệ nhanh với The Hot">
      <div className={styles.bubbles}>
        {contactItems.map(({ label, href, icon: Icon, className }, index) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith("tel:") ? undefined : "_blank"}
            rel={href.startsWith("tel:") ? undefined : "noreferrer"}
            aria-label={label}
            className={`${styles.bubble} ${className}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.45, delay: reduce ? 0 : 0.08 * index, type: "spring", stiffness: 300, damping: 20 }}
            whileHover={reduce ? undefined : { scale: 1.1, y: -3 }}
            whileTap={reduce ? undefined : { scale: 0.94 }}
          >
            {Icon ? <Icon aria-hidden size={20} strokeWidth={1.8} /> : label === "Facebook" ? <span aria-hidden className={styles.facebookMark}>f</span> : <span aria-hidden className={styles.zaloMark}>Z</span>}
            <span className={styles.bubbleLabel}>{label}</span>
          </motion.a>
        ))}
      </div>
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduce ? 0.15 : 0.55, delay: reduce ? 0 : 0.28 }}
      >
        <Link href={site.cta.href} className={styles.bookingCta}>
          <CalendarCheck aria-hidden size={19} strokeWidth={1.8} />
          <span>Đặt bàn</span>
        </Link>
      </motion.div>
    </aside>
  );
}
