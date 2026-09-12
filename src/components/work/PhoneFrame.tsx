"use client";

import { twMerge } from "tailwind-merge";
import type { CSSProperties, ReactNode } from "react";

/**
 * Intrinsic pixel size of the product captures we ship today
 * (iPhone 393×852 logical, taken at @3x).
 * Exported so galleries and pages can reuse it without re-measuring.
 */
export const DEVICE_SOURCE = { width: 1179, height: 2556 } as const;

/**
 * Intrinsic pixel size of the walkthrough captures we ship today
 * (iPhone 393×852 logical, grabbed at @2x → 786×1704).
 * Same 0.4613 aspect ratio as `DEVICE_SOURCE`, so a clip and a screenshot sit
 * in visually identical frames.
 */
export const DEVICE_VIDEO_SOURCE = { width: 786, height: 1704 } as const;

/**
 * Concentric frame geometry — outer radius minus bezel = inner radius.
 * The numbers are a fraction of what they were (46/8/38): a 46px corner and a
 * gradient bezel render a toy phone, and the argument on this site is the
 * screen, not the object holding it.
 */
const BEZEL_PX = 4;
const OUTER_RADIUS_PX = 12;
const INNER_RADIUS_PX = OUTER_RADIUS_PX - BEZEL_PX;

export interface PhoneFrameProps {
  /** Whatever fills the screen: an `<Image>`, a `<video>`, anything. */
  children: ReactNode;
  className?: string;
  /** Extra classes on the frame itself (e.g. a width cap). */
  frameClassName?: string;
  style?: CSSProperties;
}

/**
 * The bare phone frame: a 1px rule, a 12px corner, and a clipped screen.
 *
 * This markup used to exist twice, literally — once inside `DeviceMockup` and
 * once inside `DeviceVideo`, whose own comment admitted the copy. It lives here
 * now, so a still and a clip can never drift apart.
 *
 * Flat on purpose: no halo, no bloom, no drop shadow, no gradient bezel. Every
 * one of those was an invented light source, and this theme has one ink, one
 * paper and no lighting. What is left is a drawn outline that inverts cleanly
 * with the appearance because it is nothing but `--line-strong` on `--paper`.
 */
export function PhoneFrame({ children, className, frameClassName, style }: PhoneFrameProps) {
  return (
    <div className={twMerge("relative", className)} style={style}>
      <div
        className={twMerge("relative border border-[var(--line-strong)] bg-[var(--paper)]", frameClassName)}
        style={{ borderRadius: `${OUTER_RADIUS_PX}px`, padding: `${BEZEL_PX}px` }}
      >
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: `${INNER_RADIUS_PX}px`, background: "var(--paper-raised)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default PhoneFrame;
