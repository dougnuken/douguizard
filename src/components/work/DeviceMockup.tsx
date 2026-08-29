"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import type { CSSProperties, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Intrinsic pixel size of the product captures we ship today
 * (iPhone 393×852 logical, taken at @3x).
 * Exported so galleries and pages can reuse it without re-measuring.
 */
export const DEVICE_SOURCE = { width: 1179, height: 2556 } as const;

/** Concentric frame geometry — outer radius minus bezel = inner radius. */
const BEZEL_PX = 8;
const OUTER_RADIUS_PX = 46;
const INNER_RADIUS_PX = OUTER_RADIUS_PX - BEZEL_PX;

export interface DeviceMockupProps {
  /** Public path of the screenshot, e.g. `/work/olbo/semaforo-verde.png`. */
  src: string;
  /** Real, descriptive alt text. Never decorative — these screens carry the argument. */
  alt: string;
  /** Intrinsic width of the source file. Defaults to the 1179×2556 captures. */
  width?: number;
  /** Intrinsic height of the source file. */
  height?: number;
  /** Small mono/uppercase label above the caption (e.g. "01 — Ritmo"). */
  eyebrow?: string;
  /** Sentence-length caption. Renders a `<figcaption>` together with `eyebrow`. */
  caption?: ReactNode;
  /** `sizes` for next/image. Set it from the layout that owns the column widths. */
  sizes?: string;
  /** Above-the-fold only. */
  priority?: boolean;
  loading?: "eager" | "lazy";
  /** Stagger offset in seconds when several mockups animate together. */
  delay?: number;
  /** Scroll-into-view reveal. Default `true`; always off under reduced motion. */
  animate?: boolean;
  /** Sober hover lift. Default `true`; always off under reduced motion. */
  interactive?: boolean;
  className?: string;
  /** Extra classes on the frame itself (e.g. a width cap). */
  frameClassName?: string;
  style?: CSSProperties;
}

/**
 * Editorial phone frame.
 *
 * Everything is expressed with `var(--color-*)` tokens, so the same component
 * reads correctly on the dark case-study routes (`.theme-dark`) and on the
 * light base theme: the bezel is mixed from `--color-ink` over `--color-bg-deep`,
 * and the halo behind the device is `--color-ink` at ~9% — a soft light bloom on
 * dark, a soft shadow-ish bloom on bone.
 */
export default function DeviceMockup({
  src,
  alt,
  width = DEVICE_SOURCE.width,
  height = DEVICE_SOURCE.height,
  eyebrow,
  caption,
  sizes = "(max-width: 767px) 70vw, (max-width: 1279px) 38vw, 320px",
  priority = false,
  loading,
  delay = 0,
  animate = true,
  interactive = true,
  className = "",
  frameClassName = "",
  style,
}: DeviceMockupProps) {
  const reduce = useReducedMotion() ?? false;
  const motionOn = animate && !reduce;
  const hoverOn = interactive && !reduce;
  const hasCaption = Boolean(eyebrow || caption);

  return (
    <motion.figure
      // twMerge so a consumer's `max-w-*` / spacing beats the defaults.
      className={twMerge("m-0 flex w-full max-w-[420px] flex-col", className)}
      style={style}
      initial={motionOn ? { opacity: 0, y: 28 } : undefined}
      whileInView={motionOn ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={hoverOn ? { y: -6 } : undefined}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {/* isolate → the halo's negative z stays inside this box */}
      <div className="relative isolate">
        {/* Ambient halo. Token-driven so it inverts with the theme. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 blur-2xl"
          style={{
            background:
              "radial-gradient(58% 48% at 50% 46%, color-mix(in srgb, var(--color-ink) 9%, transparent) 0%, transparent 100%)",
          }}
        />

        {/* Bezel */}
        <div
          className={twMerge("relative border", frameClassName)}
          style={{
            borderRadius: `${OUTER_RADIUS_PX}px`,
            padding: `${BEZEL_PX}px`,
            borderColor: "var(--color-line-strong)",
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--color-ink) 13%, var(--color-bg-deep)) 0%, color-mix(in srgb, var(--color-ink) 6%, var(--color-bg-deep)) 55%, color-mix(in srgb, var(--color-ink) 9%, var(--color-bg-deep)) 100%)",
            boxShadow:
              "inset 0 1px 0 0 var(--glass-highlight), 0 2px 6px -3px var(--glass-shadow), 0 30px 60px -34px var(--glass-shadow)",
          }}
        >
          {/* Screen */}
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: `${INNER_RADIUS_PX}px`,
              background: "var(--color-bg-soft)",
              boxShadow:
                "inset 0 0 0 1px color-mix(in srgb, var(--color-ink) 12%, transparent)",
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              priority={priority}
              loading={priority ? undefined : loading}
              draggable={false}
              className="block h-auto w-full select-none"
            />
          </div>
        </div>
      </div>

      {hasCaption && (
        <figcaption className="mt-5">
          {eyebrow && (
            <span className="kicker block">{eyebrow}</span>
          )}
          {caption && (
            <span
              className={`block text-[13.5px] leading-[1.5] text-[var(--color-ink-muted)] ${
                eyebrow ? "mt-2" : ""
              }`}
            >
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </motion.figure>
  );
}
