"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import type { CSSProperties, ReactNode } from "react";
import { useInView, usePrefersReducedMotion } from "@/components/text/useInView";
import { PhoneFrame, DEVICE_SOURCE } from "./PhoneFrame";

export { DEVICE_SOURCE };

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
 * A product screenshot in the flat phone frame.
 *
 * The frame itself is `PhoneFrame`; this adds the reveal, the hover lift, the
 * image and the caption. The lift is 2px and carries no shadow — a surface that
 * travels far and casts light reads as a card, and these are meant to read as
 * screens.
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
  className,
  frameClassName,
  style,
}: DeviceMockupProps) {
  const reduce = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLElement>();
  const motionOn = animate && !reduce;
  const hoverOn = interactive && !reduce;
  const hasCaption = Boolean(eyebrow || caption);
  const shown = inView || !motionOn;

  return (
    <figure
      ref={ref as never}
      className={twMerge("group m-0 flex w-full max-w-[420px] flex-col", className)}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? undefined : "translateY(28px)",
        transitionProperty: "opacity, transform",
        transitionDuration: "0.9s",
        transitionDelay: `${delay}s`,
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <PhoneFrame
        frameClassName={frameClassName}
        className={hoverOn ? "transition-transform duration-300 group-hover:-translate-y-0.5" : undefined}
        style={hoverOn ? { transitionTimingFunction: "var(--ease-out)" } : undefined}
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
      </PhoneFrame>

      {hasCaption && (
        <figcaption className="mt-5">
          {eyebrow && <span className="kicker block">{eyebrow}</span>}
          {caption && (
            <span
              className={`block text-[13.5px] leading-[1.5] text-[var(--ink-muted)] ${
                eyebrow ? "mt-2" : ""
              }`}
            >
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
