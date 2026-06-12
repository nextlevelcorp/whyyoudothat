/**
 * "Cozy Lab" design system — FROZEN.
 * Do not modify without founder approval.
 *
 * Flat vector illustration, no outlines, depth via single darker-tone
 * offset shadow only. One scene = one idea, max 4 elements on screen.
 */
import {loadFont} from '@remotion/google-fonts/Nunito';

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
export const COLORS = {
  cream: '#FFF6EA', // background
  coral: '#FF6B5B', // primary / mascot
  teal: '#2EC4B6', // secondary
  mustard: '#FFB627', // highlight
  navy: '#1B2A4A', // text & details
} as const;

export type BrandColor = keyof typeof COLORS;

/**
 * Single darker-tone shadow companion for each fill color.
 * This is the ONLY depth mechanism allowed by the style lock.
 */
export const SHADOW_TONES: Record<BrandColor, string> = {
  cream: '#F0E2CE',
  coral: '#D94F41',
  teal: '#21A296',
  mustard: '#E09B12',
  navy: '#111C33',
};

/**
 * Shadow offset rule: every shape casts exactly one offset copy of itself
 * in its darker tone, shifted by this amount. No blur, no opacity tricks.
 */
export const SHADOW_OFFSET = {x: 0, y: 14} as const;

/** CSS box-shadow string implementing the shadow rule for a given color. */
export const boxShadow = (color: BrandColor): string =>
  `${SHADOW_OFFSET.x}px ${SHADOW_OFFSET.y}px 0px ${SHADOW_TONES[color]}`;

// ---------------------------------------------------------------------------
// Typography — rounded sans-serif (Nunito), navy on cream
// ---------------------------------------------------------------------------
const nunito = loadFont('normal', {
  weights: ['700', '800', '900'],
  subsets: ['latin'],
});

export const FONT_FAMILY = nunito.fontFamily;

export const TYPE = {
  hook: {fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 110, lineHeight: 1.1},
  title: {fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 72, lineHeight: 1.15},
  caption: {fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 56, lineHeight: 1.25},
  small: {fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 40, lineHeight: 1.3},
} as const;

// ---------------------------------------------------------------------------
// Animation language — spring-based easing only
// ---------------------------------------------------------------------------
export const SPRINGS = {
  /** Pop-in entrances, squash-and-stretch, celebrations. */
  bouncy: {damping: 10, stiffness: 120},
  /** Idle wiggle, drifts, subtle moves. */
  gentle: {damping: 14, stiffness: 80},
} as const;

// ---------------------------------------------------------------------------
// Format & layout
// ---------------------------------------------------------------------------
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/**
 * Safe-area margins reserved for Instagram UI overlays.
 * No text or critical content inside these bands.
 */
export const SAFE_AREA = {
  top: 220,
  bottom: 320,
  left: 60,
  right: 60,
} as const;

/** Usable content box inside the IG safe area. */
export const CONTENT_BOX = {
  x: SAFE_AREA.left,
  y: SAFE_AREA.top,
  width: VIDEO.width - SAFE_AREA.left - SAFE_AREA.right,
  height: VIDEO.height - SAFE_AREA.top - SAFE_AREA.bottom,
} as const;
