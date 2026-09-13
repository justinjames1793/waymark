"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Entrance animation for the landing page.
 *
 * globals.css disables CSS animations under prefers-reduced-motion, but
 * framer-motion drives inline transforms that rule can't reach — so the check
 * has to happen here, and it returns plain markup rather than a zero-duration
 * animation so nothing moves at all.
 */
export function Reveal({
  children,
  delay = 0,
  inView = false,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  /** Animate when scrolled into view rather than on mount. */
  inView?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  const transition = { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const };
  const hidden = { opacity: 0, y: 12 };
  const shown = { opacity: 1, y: 0 };

  if (inView) {
    return (
      <motion.div
        className={className}
        initial={hidden}
        whileInView={shown}
        viewport={{ once: true, margin: "-80px" }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div className={className} initial={hidden} animate={shown} transition={transition}>
      {children}
    </motion.div>
  );
}
