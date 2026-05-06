"use client";

import { motion } from "framer-motion";

interface CharacterFigureProps {
  className?: string;
}

/**
 * Cinematic character SVG — bald guy with backwards Yankees cap, working on a glowing laptop.
 * Drawn as silhouette with subtle highlights to feel atmospheric, not cartoonish.
 * Designed to sit in the lower-mid section of the hero, with the galaxy behind.
 */
export default function CharacterFigure({ className = "" }: CharacterFigureProps) {
  return (
    <motion.svg
      viewBox="0 0 400 360"
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Stylized illustration of a person sitting cross-legged with a laptop, wearing a backwards baseball cap"
    >
      <defs>
        {/* Laptop screen glow */}
        <radialGradient id="laptop-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd9b3" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#ff9c66" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff7b3d" stopOpacity="0" />
        </radialGradient>

        {/* Body silhouette gradient — dark base with rim light */}
        <linearGradient id="body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1820" />
          <stop offset="50%" stopColor="#0c0b12" />
          <stop offset="100%" stopColor="#050507" />
        </linearGradient>

        {/* Cap gradient — true black with subtle highlight */}
        <linearGradient id="cap-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>

        {/* Rim light from laptop side */}
        <linearGradient id="rim-light" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ffa07a" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ffa07a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffa07a" stopOpacity="0" />
        </linearGradient>

        {/* Soft shadow under figure */}
        <radialGradient id="ground-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="200" cy="335" rx="120" ry="14" fill="url(#ground-shadow)" />

      {/* Laptop glow halo — large, behind */}
      <circle cx="265" cy="220" r="80" fill="url(#laptop-glow)" opacity="0.7" />

      {/* === Character body — viewed from 3/4 back-side === */}
      {/* Crossed legs */}
      <path
        d="M 130 320
           C 120 305, 135 285, 165 280
           L 215 270
           C 245 265, 270 275, 275 295
           C 280 310, 270 322, 245 325
           L 175 330
           C 155 332, 138 328, 130 320 Z"
        fill="url(#body-gradient)"
      />

      {/* Torso — leaning slightly forward */}
      <path
        d="M 165 280
           C 160 230, 168 175, 195 150
           L 230 145
           C 252 145, 268 165, 270 200
           C 271 230, 265 260, 250 275
           C 235 285, 200 290, 175 285 Z"
        fill="url(#body-gradient)"
      />

      {/* Right arm — extended toward laptop */}
      <path
        d="M 235 195
           C 250 200, 268 215, 275 230
           C 278 240, 275 245, 268 245
           L 245 240
           C 230 235, 222 215, 230 200 Z"
        fill="url(#body-gradient)"
      />

      {/* Left arm — closer to body */}
      <path
        d="M 175 200
           C 178 220, 188 240, 200 245
           C 210 247, 215 240, 213 230
           L 205 210
           C 198 198, 185 192, 178 195 Z"
        fill="url(#body-gradient)"
      />

      {/* Hand on laptop */}
      <ellipse
        cx="265"
        cy="240"
        rx="14"
        ry="9"
        fill="#0c0b12"
        opacity="0.95"
      />

      {/* === Head — bald, tilted slightly down === */}
      <ellipse
        cx="218"
        cy="120"
        rx="32"
        ry="36"
        fill="url(#body-gradient)"
      />

      {/* Ear (subtle) */}
      <ellipse cx="190" cy="124" rx="4" ry="6" fill="#0a0910" opacity="0.6" />

      {/* === BACKWARDS YANKEES CAP === */}
      {/* Cap crown — covers top half of head, back-facing */}
      <path
        d="M 188 105
           C 188 80, 200 68, 220 67
           C 240 67, 250 78, 250 100
           L 250 115
           C 248 122, 220 125, 188 122 Z"
        fill="url(#cap-gradient)"
      />

      {/* Cap brim — at the BACK of head (so we see it pointing away) */}
      <path
        d="M 240 102
           C 252 100, 262 102, 268 108
           C 272 112, 270 116, 264 116
           L 250 116
           C 245 116, 242 112, 240 108 Z"
        fill="url(#cap-gradient)"
      />

      {/* Yankees "NY" detail — visible on the back since cap is reversed */}
      <g transform="translate(213, 88)" opacity="0.95">
        {/* "N" stroke */}
        <path
          d="M 0 0 L 0 12 M 0 0 L 7 12 M 7 0 L 7 12"
          stroke="#ebe9e0"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* "Y" stroke (overlapping the N like the real logo) */}
        <path
          d="M 1 0 L 5 6 L 9 0 M 5 6 L 5 12"
          stroke="#ebe9e0"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Cap adjustment strap (back of cap) */}
      <rect
        x="208"
        y="118"
        width="20"
        height="3"
        fill="#0a0a0a"
        opacity="0.8"
      />

      {/* === LAPTOP === */}
      {/* Laptop body (closed-ish silhouette from side) */}
      <g transform="translate(255, 200)">
        {/* Base */}
        <rect x="0" y="35" width="50" height="6" rx="1" fill="#1f1d28" />
        {/* Screen back */}
        <path
          d="M 5 35
             L 8 5
             L 45 5
             L 47 35 Z"
          fill="#15131c"
          stroke="#2a2733"
          strokeWidth="0.5"
        />
        {/* Screen glow front (the "screen" surface — bright) */}
        <path
          d="M 9 32
             L 11 8
             L 42 8
             L 44 32 Z"
          fill="#ffb380"
          opacity="0.85"
        />
        {/* Screen reflection */}
        <path
          d="M 9 32
             L 11 8
             L 25 8
             L 23 32 Z"
          fill="#fff5e0"
          opacity="0.4"
        />
      </g>

      {/* Rim light on right side of figure (from laptop) */}
      <path
        d="M 250 145
           C 268 165, 275 195, 270 230
           L 268 240
           L 252 235
           C 256 200, 252 165, 240 150 Z"
        fill="url(#rim-light)"
        opacity="0.5"
      />

      {/* Subtle face highlight (cheekbone catching laptop glow) */}
      <ellipse
        cx="240"
        cy="125"
        rx="6"
        ry="4"
        fill="#ffa07a"
        opacity="0.18"
      />
    </motion.svg>
  );
}
