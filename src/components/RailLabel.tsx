"use client";

import { useEffect, useRef, useState } from "react";
import { sections } from "@/data/sections";
import { stepSpring, type Spring } from "@/lib/spring";

/* ── The standing label: one reel per letter ────────────────────────────────
   Every letter of the word beside the drum sits on its own small wheel. When
   the section changes, each wheel spins to its new letter and the reels drop
   into place one after another, top to bottom, on the same spring as the
   drum. A letter that is already right — the O of HOME → WORK — does not move
   at all, and that is most of what makes it read as a mechanism rather than
   as a text effect.

   The reels turn in the GLYPH's frame, not the page's. The word stands on
   end, so its letters are rotated 90°; a slot machine stood on its side has
   its axles along the word and its wheels turning across it, and that is what
   these do — tilt your head to read the word and each letter rolls up like a
   counter. Turning them along the page's vertical instead, the way the drum
   turns, was tried and dropped: the travel is then capped by the 8px cell
   each letter owns, every reel has to be clipped to it, and at 10px a glyph
   clipped mid-roll reads as a rendering fault, not as motion.

   Each reel is a tape of faces indexed by integer position, walked by a
   spring. A new word writes a short path onto the tape AHEAD of whatever is
   on screen — never over it — so a reel can be retargeted mid-spin, or
   reversed, without a face popping. The path runs through the letters just
   before the target (… U V W), so a reel lands on its letter the way a
   counter lands on a digit. */

/** One reel per letter of the longest label. */
const SLOTS = Math.max(...sections.map((s) => s.label.length));
/** Face elements per reel. The fade never shows more than two; three cover rounding. */
const FACES = 3;
/** Degrees between faces, the reel's radius in px, and its lens. */
const STEP = 50;
const RADIUS = 12;
const PERSPECTIVE = 60;
/** Seconds between one reel starting and the next, so the word lands top to bottom. */
const STAGGER = 0.032;
/** The most faces a reel spins through. Past four it is a blur either way. */
const MAX_SPIN = 4;
/* The fade, in faces from the centre: whole up to 0.2, gone by 0.8, on a
   smoothstep between. It has to be gone well short of 1 because the spring
   overshoots by ~7% of the trip — on a four-face spin that swings the NEXT
   letter 0.28 of a face into view, and a linear fade left it hanging beside
   the word as a ghost for a quarter of a second. */
const FADE_FROM = 0.2;
const FADE_TO = 0.8;
/** One letter cell: the mono advance plus the 0.2em tracking. */
const CELL = "(1ch + 0.2em)";

const rad = (d: number) => (d * Math.PI) / 180;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const wrap = (n: number) => ((n % FACES) + FACES) % FACES;
const LETTER = /^[A-Z]$/;

/** The letter `k` places along the alphabet from `c`, wrapping. Blank stays blank. */
const shift = (c: string, k: number) =>
  LETTER.test(c) ? String.fromCharCode(65 + ((((c.charCodeAt(0) - 65 + k) % 26) + 26) % 26)) : "";

/** A label as one character per reel, padded with blanks. */
const charsOf = (index: number) => {
  const word = sections[index].label.toUpperCase();
  return Array.from({ length: SLOTS }, (_, i) => word[i] ?? "");
};

interface Reel {
  spring: Spring;
  /** The tape position the reel is heading for. */
  goal: number;
  tape: Map<number, string>;
  /** A retarget waiting for this reel's turn in the stagger. */
  pending: { char: string; dir: 1 | -1; at: number } | null;
  asleep: boolean;
}

const restingReel = (char: string): Reel => ({
  spring: { pos: 0, vel: 0 },
  goal: 0,
  tape: new Map([[0, char]]),
  pending: null,
  asleep: true,
});

/** Writes the path to `char` onto the tape, travelling in `dir`, and points the reel at it. */
function retarget(r: Reel, char: string, dir: 1 | -1) {
  if ((r.tape.get(r.goal) ?? "") === char) return;
  const p = r.spring.pos;
  const near = Math.round(p);
  const from = r.tape.get(near) ?? "";

  // The last face in the direction of travel that is still visible. It and
  // everything before it stays exactly as it is; the path starts after it.
  const edge = dir > 0 ? Math.ceil(p + FADE_TO) - 1 : Math.floor(p - FADE_TO) + 1;
  for (let n = near + dir; dir > 0 ? n <= edge : n >= edge; n += dir) {
    if (!r.tape.has(n)) r.tape.set(n, shift(from, n - near));
  }

  // Blank is one face away from anything. A letter out of a blank comes in
  // through one lead-in; letter to letter spins its alphabetic distance.
  const spin = !char
    ? 1
    : !from
      ? 2
      : clamp(Math.abs(char.charCodeAt(0) - from.charCodeAt(0)), 1, MAX_SPIN);
  const goal = edge + dir * spin;
  // Two faces past the goal as well, for the overshoot to swing into. They
  // continue the alphabet, so what shows for that instant is the next letter.
  for (let j = 1; j <= spin + 2; j++) {
    const n = edge + dir * j;
    r.tape.set(n, shift(char, n - goal));
  }
  for (const n of r.tape.keys()) {
    if (Math.abs(n - p) > 12 && Math.abs(n - goal) > 12) r.tape.delete(n);
  }
  r.goal = goal;
  r.asleep = false;
}

/** Paints one reel. Transform and opacity only, plus a face's letter when it changes. */
function paintReel(r: Reel, faces: (HTMLSpanElement | null)[]) {
  const p = r.spring.pos;
  const base = Math.round(p);
  for (let n = base - 1; n <= base + 1; n++) {
    const el = faces[wrap(n)];
    if (!el) continue;
    const ch = r.tape.get(n) ?? "";
    if (el.textContent !== ch) el.textContent = ch;
    const d = n - p;
    if (r.asleep) {
      // At rest the face carries no transform at all, so the word is set
      // exactly as plain text would be — same raster, same crispness.
      el.style.transform = "";
      el.style.opacity = d === 0 ? "" : "0";
      continue;
    }
    const t = clamp((Math.abs(d) - FADE_FROM) / (FADE_TO - FADE_FROM), 0, 1);
    el.style.opacity = (1 - t * t * (3 - 2 * t)).toFixed(3);
    // `writing-mode` has turned the glyph 90° clockwise, so the glyph's
    // "down" is the page's left, and turning about the glyph's horizontal
    // axis is turning about the page's vertical one: a face `d` ahead sits
    // R·sin φ to the left, tilted by rotateY. Negative φ keeps it convex.
    const phi = d * STEP;
    const x = -RADIUS * Math.sin(rad(phi));
    el.style.transform = `translateX(${x.toFixed(2)}px) perspective(${PERSPECTIVE}px) rotateY(${(-phi).toFixed(2)}deg)`;
  }
}

export default function RailLabel({ index }: { index: number }) {
  // The first word is server-rendered as plain text; after that the reels
  // own the faces, and React never writes their text again.
  const [first] = useState(index);
  const boxRef = useRef<HTMLSpanElement>(null);
  const faces = useRef<(HTMLSpanElement | null)[]>([]);
  const reels = useRef<Reel[] | null>(null);
  reels.current ??= charsOf(first).map(restingReel);
  const prev = useRef(first);
  const raf = useRef(0);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      cancelAnimationFrame(raf.current);
      // Zeroed, not just cancelled: the index effect reads a non-zero id as
      // "a loop is running" and would never start another one.
      raf.current = 0;
    };
  }, []);

  useEffect(() => {
    if (index === prev.current) return;
    const dir: 1 | -1 = index > prev.current ? 1 : -1;
    prev.current = index;
    const all = reels.current!;
    const chars = charsOf(index);
    const facesOf = (s: number) => faces.current.slice(s * FACES, s * FACES + FACES);

    // Reduced motion gets the word, not the spin — and so does a rail that
    // is not on screen (below `lg` it is display:none), which has nobody to
    // spin for.
    if (reduce.current || !boxRef.current?.getClientRects().length) {
      all.forEach((r, s) => {
        r.pending = null;
        r.tape.set(r.goal, chars[s]);
        if (r.asleep) paintReel(r, facesOf(s));
      });
      return;
    }

    const now = performance.now() / 1000;
    all.forEach((r, s) => {
      r.pending = { char: chars[s], dir, at: now + s * STAGGER };
    });

    if (raf.current) return; // A loop is already running; it will pick these up.
    let last = performance.now();
    const tick = (t: number) => {
      const dt = clamp((t - last) / 1000, 0, 0.05);
      last = t;
      let busy = false;
      all.forEach((r, s) => {
        if (r.pending && t / 1000 >= r.pending.at) {
          retarget(r, r.pending.char, r.pending.dir);
          r.pending = null;
        }
        if (!r.asleep) {
          r.asleep = stepSpring(r.spring, r.goal, dt);
          paintReel(r, facesOf(s));
        }
        if (!r.asleep || r.pending) busy = true;
      });
      raf.current = busy ? requestAnimationFrame(tick) : 0;
    };
    raf.current = requestAnimationFrame(tick);
  }, [index]);

  const len = sections[index].label.length;

  return (
    <span
      ref={boxRef}
      aria-hidden
      className="rail-vlabel relative block w-4 select-none text-[10px] uppercase leading-4 tracking-[0.2em] text-[var(--ink-muted)]"
      style={{ height: `calc(${SLOTS} * ${CELL})` }}
    >
      {/* The box is as tall as the longest word, so it never resizes; the
          strip slides inside it to keep whichever word is up centred on the
          active row, exactly where the plain label used to sit. */}
      <span
        className="rail-vlabel-strip absolute inset-0"
        style={{ transform: `translateY(calc(${(SLOTS - len) / 2} * ${CELL}))` }}
      >
        {charsOf(first).map((c, s) => (
          <span
            key={s}
            className="absolute left-0 w-4"
            style={{ top: `calc(${s} * ${CELL})`, height: `calc(${CELL})` }}
          >
            {Array.from({ length: FACES }, (_, j) => (
              <span
                key={j}
                ref={(el) => {
                  faces.current[s * FACES + j] = el;
                }}
                className="absolute inset-0"
                style={j ? { opacity: 0 } : undefined}
              >
                {j ? "" : c}
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}
