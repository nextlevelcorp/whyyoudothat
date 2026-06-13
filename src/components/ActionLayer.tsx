import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY, SHADOW_TONES, SPRINGS, boxShadow, BrandColor} from '../design-system';
import type {SceneAction} from '../scripts/schema';

type ActionLayerProps = {
  action: SceneAction;
  /** Width/height of the square stage the action plays in. */
  size?: number;
};

const CARD_COLORS = [COLORS.teal, COLORS.mustard, COLORS.coral] as const;

/** Phone with a feed that scrolls forever — "one more swipe". */
const Scroll: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const phoneW = 380 * u;
  const phoneH = 560 * u;
  const cardH = 130 * u;
  const gap = 30 * u;
  const cycle = (cardH + gap) * CARD_COLORS.length;
  const offset = (frame * 5 * u) % cycle;

  return (
    <div
      style={{
        width: phoneW,
        height: phoneH,
        margin: '0 auto',
        backgroundColor: COLORS.navy,
        borderRadius: 56 * u,
        boxShadow: boxShadow('navy'),
        padding: 22 * u,
        // The whole phone nods with each "swipe" so it never sits still.
        transform: `rotate(${Math.sin(frame / 8) * 2}deg)`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: COLORS.cream,
          borderRadius: 36 * u,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = ((i * (cardH + gap) - offset) % (cycle * 2) + cycle * 2) % (cycle * 2) - cardH;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 24 * u,
                right: 24 * u,
                top: y,
                height: cardH,
                borderRadius: 24 * u,
                backgroundColor: CARD_COLORS[i % CARD_COLORS.length],
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/** Repeating sparkle bursts — the dopamine "maybe a reward!" hit. */
const Burst: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const cycleLen = 26;
  const p = (frame % cycleLen) / cycleLen;
  const wave = Math.floor(frame / cycleLen);
  const dots = 8;

  return (
    <div style={{position: 'relative', width: size, height: size, margin: '0 auto'}}>
      {Array.from({length: dots}).map((_, i) => {
        const angle = (i / dots) * Math.PI * 2 + wave * 0.4;
        const radius = interpolate(p, [0, 1], [40, size * 0.46]);
        const dotSize = interpolate(p, [0, 1], [44, 14]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: size / 2 + Math.cos(angle) * radius - dotSize / 2,
              top: size / 2 + Math.sin(angle) * radius - dotSize / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: CARD_COLORS[(i + wave) % CARD_COLORS.length],
              opacity: 1 - p,
            }}
          />
        );
      })}
      {/* Pulsing core */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: size * 0.18,
          height: size * 0.18,
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame / 4) * 0.18})`,
          borderRadius: '50%',
          backgroundColor: COLORS.mustard,
          boxShadow: boxShadow('mustard'),
        }}
      />
    </div>
  );
};

/** Dots chasing each other on a circle — stuck in the loop. */
const Loop: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const radius = size * 0.36;

  return (
    <div style={{position: 'relative', width: size, height: size, margin: '0 auto'}}>
      {/* Track: ring of faint dots so the circle reads as a path */}
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <div
            key={`t-${i}`}
            style={{
              position: 'absolute',
              left: size / 2 + Math.cos(a) * radius - 9,
              top: size / 2 + Math.sin(a) * radius - 9,
              width: 18,
              height: 18,
              borderRadius: '50%',
              backgroundColor: SHADOW_TONES.cream,
            }}
          />
        );
      })}
      {/* Runners: three colored dots chasing each other, never arriving */}
      {[0, 1, 2].map((i) => {
        const a = frame * 0.09 + (i / 3) * Math.PI * 2;
        const s = 56 + Math.sin(frame / 7 + i) * 8;
        return (
          <div
            key={`r-${i}`}
            style={{
              position: 'absolute',
              left: size / 2 + Math.cos(a) * radius - s / 2,
              top: size / 2 + Math.sin(a) * radius - s / 2,
              width: s,
              height: s,
              borderRadius: '50%',
              backgroundColor: CARD_COLORS[i],
            }}
          />
        );
      })}
    </div>
  );
};

/** Friction wall: a navy wall + lock pops in and blocks a shaking phone. */
const Barrier: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;

  const wallIn = spring({frame: frame - 8, fps, config: SPRINGS.bouncy, durationInFrames: 25});
  // The phone keeps lunging at the wall and bouncing off.
  const lunge = Math.abs(Math.sin(frame / 10)) * 40 * u;

  return (
    <div style={{position: 'relative', width: size, height: size * 0.9, margin: '0 auto'}}>
      {/* Mini phone trying to reach you */}
      <div
        style={{
          position: 'absolute',
          left: 40 * u + lunge,
          top: size * 0.28,
          width: 170 * u,
          height: 260 * u,
          backgroundColor: COLORS.coral,
          borderRadius: 32 * u,
          boxShadow: boxShadow('coral'),
          transform: `rotate(${-8 + Math.sin(frame / 10) * 6}deg)`,
        }}
      >
        <div
          style={{
            margin: 14 * u,
            width: 142 * u,
            height: 200 * u,
            backgroundColor: COLORS.cream,
            borderRadius: 20 * u,
          }}
        />
      </div>

      {/* The wall of friction */}
      <div
        style={{
          position: 'absolute',
          left: '55%',
          top: size * 0.08,
          width: 130 * u,
          height: size * 0.74,
          backgroundColor: COLORS.navy,
          borderRadius: 40 * u,
          boxShadow: boxShadow('navy'),
          transform: `scaleY(${wallIn})`,
          transformOrigin: '50% 100%',
        }}
      />

      {/* Lock badge on the wall */}
      <div
        style={{
          position: 'absolute',
          left: `calc(55% + ${65 * u}px)`,
          top: size * 0.38,
          transform: `translateX(-50%) scale(${spring({
            frame: frame - 22,
            fps,
            config: SPRINGS.bouncy,
            durationInFrames: 20,
          })})`,
        }}
      >
        <div
          style={{
            width: 90 * u,
            height: 56 * u,
            margin: '0 auto',
            borderRadius: `${45 * u}px ${45 * u}px 0 0`,
            backgroundColor: SHADOW_TONES.mustard,
          }}
        />
        <div
          style={{
            width: 130 * u,
            height: 100 * u,
            borderRadius: 26 * u,
            backgroundColor: COLORS.mustard,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 26 * u,
              height: 40 * u,
              borderRadius: 14 * u,
              backgroundColor: COLORS.navy,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/** Slot machine with spinning reels and a pulling lever — the variable
 * reward schedule, made literal. */
const SlotMachine: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const bodyW = 380 * u;
  const bodyH = 300 * u;
  const reelW = 86 * u;
  const dotH = 70 * u;
  const gap = 18 * u;
  const cycle = (dotH + gap) * CARD_COLORS.length;
  // Lever pulls down periodically, reels speed up right after each pull.
  const pull = Math.max(0, Math.sin(frame / 14)) ** 3;

  return (
    <div style={{position: 'relative', width: bodyW + 120 * u, margin: '0 auto'}}>
      <div
        style={{
          width: bodyW,
          height: bodyH,
          backgroundColor: COLORS.navy,
          borderRadius: 48 * u,
          boxShadow: boxShadow('navy'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20 * u,
          transform: `translateY(${pull * 8}px)`,
        }}
      >
        {[0, 1, 2].map((r) => {
          const speed = [7, 9, 5][r] * u * (1 + pull * 2);
          const offset = (frame * speed) % cycle;
          return (
            <div
              key={r}
              style={{
                width: reelW,
                height: bodyH - 70 * u,
                backgroundColor: COLORS.cream,
                borderRadius: 24 * u,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {[0, 1, 2, 3].map((i) => {
                const y =
                  ((i * (dotH + gap) - offset) % (cycle * 2) + cycle * 2) % (cycle * 2) -
                  dotH;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: (reelW - dotH) / 2,
                      top: y,
                      width: dotH,
                      height: dotH,
                      borderRadius: '50%',
                      backgroundColor: CARD_COLORS[(i + r) % CARD_COLORS.length],
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {/* Lever */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: bodyH * 0.18,
          width: 26 * u,
          height: 150 * u,
          borderRadius: 26 * u,
          backgroundColor: COLORS.coral,
          transformOrigin: '50% 100%',
          transform: `rotate(${pull * 60}deg)`,
          boxShadow: boxShadow('coral'),
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -36 * u,
            left: -22 * u,
            width: 70 * u,
            height: 70 * u,
            borderRadius: '50%',
            backgroundColor: COLORS.mustard,
            boxShadow: boxShadow('mustard'),
          }}
        />
      </div>
    </div>
  );
};

/** An urge: a teal wave that swells and dies while the small navy
 * friction step just stands there and outlasts it. */
const Wave: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const cycle = 70;
  const p = (frame % cycle) / cycle;
  const swell = Math.sin(p * Math.PI); // rises, peaks, dies

  return (
    <div style={{position: 'relative', width: size, height: 320 * u, margin: '0 auto'}}>
      {/* Ground line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 30 * u,
          right: 30 * u,
          height: 22 * u,
          borderRadius: 22 * u,
          backgroundColor: SHADOW_TONES.cream,
        }}
      />
      {/* The urge wave: swells up and washes out, again and again */}
      <div
        style={{
          position: 'absolute',
          bottom: 12 * u,
          left: 60 * u,
          width: 300 * u,
          height: 270 * u * Math.max(swell, 0.02),
          borderRadius: '50% 50% 12% 12% / 100% 100% 0% 0%',
          backgroundColor: COLORS.teal,
          boxShadow: boxShadow('teal'),
          opacity: 0.35 + swell * 0.65,
          transformOrigin: '50% 100%',
          transform: `rotate(${Math.sin(frame / 9) * 2}deg)`,
        }}
      />
      {/* The friction step: small, navy, unbothered */}
      <div
        style={{
          position: 'absolute',
          bottom: 12 * u,
          right: 80 * u,
          width: 130 * u,
          height: 150 * u + Math.sin(frame / 18) * 3,
          borderRadius: 30 * u,
          backgroundColor: COLORS.navy,
          boxShadow: boxShadow('navy'),
        }}
      />
    </div>
  );
};

/**
 * Animated bar chart: dopamine response vs reward probability. Bars pop
 * up one by one and peak at 50% — "maybe" — which pulses and throws
 * sparkles, while the sure thing (100%) stays low. Shows the Schultz-style
 * inverted-U the narration describes.
 */
const Chart: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;

  const bars = [
    {label: '0%', h: 0.18},
    {label: '25%', h: 0.55},
    {label: '50%', h: 1.0, peak: true},
    {label: '75%', h: 0.55},
    {label: '100%', h: 0.22},
  ];
  const maxH = 280 * u;
  const barW = 78 * u;
  const gap = 26 * u;
  const chartW = bars.length * barW + (bars.length - 1) * gap;

  // Sparkles popping off the peak bar.
  const cycleLen = 24;
  const p = (frame % cycleLen) / cycleLen;
  const wave = Math.floor(frame / cycleLen);
  const peakX = 2 * (barW + gap) + barW / 2;

  return (
    <div style={{position: 'relative', width: chartW, margin: '0 auto'}}>
      {/* Axis title */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 34 * u,
          letterSpacing: 3,
          color: COLORS.navy,
          marginBottom: 18 * u,
        }}
      >
        DOPAMINE
      </div>

      {/* Bars */}
      <div style={{position: 'relative', height: maxH, display: 'flex', gap, alignItems: 'flex-end'}}>
        {bars.map((bar, i) => {
          const rise = spring({
            frame: frame - 6 - i * 5,
            fps,
            config: SPRINGS.bouncy,
            durationInFrames: 24,
          });
          const pulse = bar.peak ? 1 + Math.sin(frame / 8) * 0.05 : 1 + Math.sin(frame / 14 + i) * 0.015;
          return (
            <div
              key={i}
              style={{
                width: barW,
                height: maxH * bar.h,
                borderRadius: 22 * u,
                backgroundColor: bar.peak ? COLORS.mustard : COLORS.teal,
                boxShadow: boxShadow(bar.peak ? 'mustard' : 'teal'),
                transform: `scaleY(${rise * pulse})`,
                transformOrigin: '50% 100%',
              }}
            />
          );
        })}

        {/* Sparkles above the "maybe" bar */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = -Math.PI * (0.15 + (i / 4) * 0.7) + Math.sin(wave) * 0.1;
          const radius = interpolate(p, [0, 1], [16 * u, 120 * u]);
          const dotSize = interpolate(p, [0, 1], [26 * u, 8 * u]);
          return (
            <div
              key={`s-${i}`}
              style={{
                position: 'absolute',
                left: peakX + Math.cos(angle) * radius - dotSize / 2,
                top: maxH - maxH * 1.0 + Math.sin(angle) * radius - 10 * u,
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: [COLORS.coral, COLORS.mustard][i % 2],
                opacity: 1 - p,
              }}
            />
          );
        })}
      </div>

      {/* Baseline */}
      <div
        style={{
          height: 16 * u,
          borderRadius: 16 * u,
          backgroundColor: COLORS.navy,
          margin: `${14 * u}px 0`,
        }}
      />

      {/* Probability labels: chance of a reward */}
      <div style={{display: 'flex', gap}}>
        {bars.map((bar, i) => (
          <div
            key={i}
            style={{
              width: barW,
              textAlign: 'center',
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 30 * u,
              color: bar.peak ? COLORS.coral : COLORS.navy,
            }}
          >
            {bar.label}
          </div>
        ))}
      </div>
      <div
        style={{
          textAlign: 'center',
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: 28 * u,
          letterSpacing: 2,
          color: COLORS.navy,
          marginTop: 8 * u,
        }}
      >
        CHANCE OF A REWARD
      </div>
    </div>
  );
};

/** App icon being dragged off the phone screen and tossed away. */
const DragAway: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const phoneW = 300 * u;
  const phoneH = 380 * u;
  const cycle = 80;
  const p = (frame % cycle) / cycle;
  // Phases: 0–0.3 icon wiggles in place, 0.3–0.8 dragged out, then respawn.
  const drag = interpolate(p, [0.3, 0.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wiggle = p < 0.3 ? Math.sin(frame * 1.4) * 4 : 0;

  return (
    <div style={{position: 'relative', width: size, height: phoneH, margin: '0 auto'}}>
      <div
        style={{
          position: 'absolute',
          left: 60 * u,
          width: phoneW,
          height: phoneH,
          backgroundColor: COLORS.navy,
          borderRadius: 44 * u,
          boxShadow: boxShadow('navy'),
          padding: 18 * u,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: COLORS.cream,
            borderRadius: 30 * u,
            position: 'relative',
          }}
        >
          {/* Remaining boring apps */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 30 * u + (i % 2) * 110 * u,
                top: 30 * u + Math.floor(i / 2) * 110 * u,
                width: 76 * u,
                height: 76 * u,
                borderRadius: 22 * u,
                backgroundColor: SHADOW_TONES.cream,
              }}
            />
          ))}
        </div>
      </div>
      {/* The app being exiled: dragged off screen, shrinking as it goes */}
      <div
        style={{
          position: 'absolute',
          left: 90 * u + 110 * u + drag * 320 * u + wiggle,
          top: 160 * u - Math.sin(drag * Math.PI) * 90 * u,
          width: 86 * u,
          height: 86 * u,
          borderRadius: 24 * u,
          backgroundColor: COLORS.coral,
          boxShadow: boxShadow('coral'),
          opacity: 1 - Math.max(0, drag - 0.7) / 0.3,
          transform: `scale(${1 - drag * 0.3}) rotate(${drag * 50}deg)`,
        }}
      />
    </div>
  );
};

/** A small label pill used by the narrative actions. */
const Pill: React.FC<{
  text: string;
  color: BrandColor;
  textColor?: string;
  u: number;
  style?: React.CSSProperties;
}> = ({text, color, textColor = COLORS.cream, u, style}) => (
  <div
    style={{
      fontFamily: FONT_FAMILY,
      fontWeight: 900,
      fontSize: 26 * u,
      letterSpacing: 2,
      color: textColor,
      backgroundColor: COLORS[color],
      borderRadius: 999,
      padding: `${8 * u}px ${22 * u}px`,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {text}
  </div>
);

/** Free choice in the lab: LEFT / RIGHT buttons, a cursor pressing one,
 * a ticking clock. Acts out "press left or right, totally up to them." */
const FreeChoice: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  // Cursor drifts left<->right and "presses" at each extreme.
  const swing = Math.sin(frame / 22);
  const onLeft = swing < 0;
  const press = Math.abs(swing) > 0.85 ? (Math.abs(swing) - 0.85) / 0.15 : 0;

  const button = (label: string, active: boolean, color: BrandColor) => (
    <div
      style={{
        width: 200 * u,
        height: 150 * u,
        borderRadius: 36 * u,
        backgroundColor: COLORS[color],
        boxShadow: boxShadow(color),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_FAMILY,
        fontWeight: 900,
        fontSize: 46 * u,
        color: COLORS.navy,
        transform: `scale(${active && press > 0 ? 1 - press * 0.1 : 1})`,
      }}
    >
      {label}
    </div>
  );

  return (
    <div style={{position: 'relative', width: size, margin: '0 auto'}}>
      <div style={{display: 'flex', gap: 48 * u, justifyContent: 'center'}}>
        {button('LEFT', onLeft, 'teal')}
        {button('RIGHT', !onLeft, 'mustard')}
      </div>

      {/* Cursor hand: a coral dot that slides between the buttons */}
      <div
        style={{
          position: 'absolute',
          top: 60 * u,
          left: size / 2 + swing * 150 * u - 28 * u,
          width: 56 * u,
          height: 56 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.coral,
          boxShadow: boxShadow('coral'),
          transform: `translateY(${press * 26 * u}px)`,
        }}
      />

      {/* Ticking clock */}
      <div
        style={{
          position: 'absolute',
          right: -10 * u,
          top: -20 * u,
          width: 96 * u,
          height: 96 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.cream,
          boxShadow: boxShadow('cream'),
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 6 * u,
            height: 36 * u,
            backgroundColor: COLORS.navy,
            borderRadius: 6 * u,
            transformOrigin: '50% 100%',
            transform: `translate(-50%, -100%) rotate(${frame * 6}deg)`,
          }}
        />
      </div>
    </div>
  );
};

/** The readiness-potential timeline: a playhead sweeps -7s -> 0s; the
 * brain signal (teal) fires early, the "you feel you decided" marker
 * (coral) only pops at 0s. Visualizes the seven-second gap. */
const Readiness: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;
  const trackW = size;
  const cycle = 170;
  const p = (frame % cycle) / cycle; // 0..1 across the replay
  const brainX = trackW * 0.1; // brain fires here (~-7s)
  const awareX = trackW * 0.9; // you notice here (0s)
  // Playhead sweeps to 0s by 70% of the cycle, then holds so the reveal lands.
  const sweep = Math.min(1, p / 0.7);
  const headX = brainX + (awareX - brainX) * sweep;

  const brainLit = p > 0.04;
  const awarePop = spring({
    frame: (frame % cycle) - cycle * 0.66,
    fps,
    config: SPRINGS.bouncy,
    durationInFrames: 16,
  });

  // Three stacked bands so nothing collides:
  const gapY = 0; // band A: "~7 SECONDS"
  const trackY = 132 * u; // band B: the timeline
  const labelY = 184 * u; // band C: the two markers' labels

  return (
    <div style={{position: 'relative', width: size, height: 250 * u, margin: '0 auto'}}>
      {/* Band A: the gap headline */}
      <div
        style={{
          position: 'absolute',
          top: gapY,
          left: 0,
          width: trackW,
          textAlign: 'center',
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 46 * u,
          color: COLORS.coral,
        }}
      >
        ~7 SECONDS
      </div>

      {/* Band B: rising brain-signal area up to the playhead */}
      <div
        style={{
          position: 'absolute',
          left: brainX,
          top: trackY - 50 * u,
          width: Math.max(0, headX - brainX),
          height: 50 * u,
          backgroundColor: COLORS.teal,
          opacity: 0.4,
          borderRadius: `${16 * u}px ${16 * u}px 0 0`,
        }}
      />
      {/* timeline axis */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: trackY,
          width: trackW,
          height: 12 * u,
          borderRadius: 12 * u,
          backgroundColor: COLORS.navy,
        }}
      />
      {/* brain-decides marker (fires early) */}
      <div
        style={{
          position: 'absolute',
          left: brainX - 26 * u,
          top: trackY - 20 * u,
          width: 52 * u,
          height: 52 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.teal,
          boxShadow: boxShadow('teal'),
          transform: `scale(${brainLit ? 1 + Math.sin(frame / 5) * 0.12 : 0.6})`,
        }}
      />
      {/* you-notice marker (pops at 0s) */}
      <div
        style={{
          position: 'absolute',
          left: awareX - 26 * u,
          top: trackY - 20 * u,
          width: 52 * u,
          height: 52 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.coral,
          boxShadow: boxShadow('coral'),
          transform: `scale(${awarePop})`,
        }}
      />
      {/* playhead */}
      <div
        style={{
          position: 'absolute',
          left: headX - 3 * u,
          top: trackY - 34 * u,
          width: 6 * u,
          height: 70 * u,
          borderRadius: 6 * u,
          backgroundColor: COLORS.mustard,
        }}
      />

      {/* Band C: the two labels, pinned left and right */}
      <Pill
        text="BRAIN DECIDES"
        color="teal"
        u={u}
        style={{position: 'absolute', top: labelY, left: 0}}
      />
      <Pill
        text="YOU NOTICE"
        color="coral"
        u={u}
        style={{position: 'absolute', top: labelY, right: 0, transform: `scale(${awarePop})`}}
      />
    </div>
  );
};

/** Backstage: a little "you" figure up front wears a CEO crown that keeps
 * slipping off, while behind a curtain the brain works the levers. Acts
 * out "you're the narrator, not the CEO." */
const Backstage: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const crownSlip = (Math.sin(frame / 18) + 1) / 2; // 0..1 slipping

  return (
    <div style={{position: 'relative', width: size, height: 360 * u, margin: '0 auto'}}>
      {/* Curtain pulled aside, revealing backstage */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 300 * u,
          height: 360 * u,
          backgroundColor: COLORS.cream,
          boxShadow: boxShadow('cream'),
          borderRadius: 24 * u,
          overflow: 'hidden',
        }}
      >
        {/* Brain working levers */}
        <div
          style={{
            position: 'absolute',
            left: 60 * u,
            top: 120 * u,
            width: 150 * u,
            height: 150 * u,
            borderRadius: '48% 52% 55% 45% / 55% 60% 40% 45%',
            backgroundColor: COLORS.teal,
            boxShadow: boxShadow('teal'),
          }}
        />
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 40 * u + i * 180 * u,
              top: 60 * u,
              width: 22 * u,
              height: 110 * u,
              borderRadius: 22 * u,
              backgroundColor: COLORS.navy,
              transformOrigin: '50% 100%',
              transform: `rotate(${Math.sin(frame / 7 + i * 2) * 22}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -26 * u,
                left: -16 * u,
                width: 54 * u,
                height: 54 * u,
                borderRadius: '50%',
                backgroundColor: COLORS.coral,
              }}
            />
          </div>
        ))}
      </div>

      {/* The teal curtain edge */}
      <div
        style={{
          position: 'absolute',
          left: 250 * u,
          top: -10 * u,
          width: 70 * u,
          height: 380 * u,
          backgroundColor: COLORS.teal,
          boxShadow: boxShadow('teal'),
          borderRadius: 20 * u,
        }}
      />

      {/* The "you" figure up front */}
      <div style={{position: 'absolute', left: 30 * u, top: 70 * u}}>
        {/* Sliding CEO crown */}
        <div
          style={{
            position: 'absolute',
            left: 18 * u,
            top: -54 * u + crownSlip * 70 * u,
            transform: `rotate(${crownSlip * 28}deg)`,
          }}
        >
          <div
            style={{
              width: 90 * u,
              height: 50 * u,
              backgroundColor: COLORS.mustard,
              boxShadow: boxShadow('mustard'),
              clipPath:
                'polygon(0% 100%, 0% 30%, 25% 55%, 50% 0%, 75% 55%, 100% 30%, 100% 100%)',
            }}
          />
          <div
            style={{
              textAlign: 'center',
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontSize: 20 * u,
              color: COLORS.navy,
            }}
          >
            CEO
          </div>
        </div>
        {/* Head */}
        <div
          style={{
            width: 120 * u,
            height: 120 * u,
            borderRadius: '50%',
            backgroundColor: COLORS.navy,
            boxShadow: boxShadow('navy'),
            position: 'relative',
          }}
        >
          {[-1, 1].map((s) => (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: `calc(50% + ${s * 22 * u}px - ${7 * u}px)`,
                top: 46 * u,
                width: 14 * u,
                height: 14 * u,
                borderRadius: '50%',
                backgroundColor: COLORS.cream,
              }}
            />
          ))}
        </div>
        {/* Body */}
        <div
          style={{
            width: 150 * u,
            height: 150 * u,
            marginLeft: -15 * u,
            marginTop: -10 * u,
            borderRadius: `${40 * u}px ${40 * u}px ${30 * u}px ${30 * u}px`,
            backgroundColor: COLORS.navy,
            boxShadow: boxShadow('navy'),
          }}
        />
      </div>
    </div>
  );
};

/** A coin tumbling and settling at ~60% — "only about 60% accurate." */
const CoinFlip: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  // Coin tumbles (scaleX wobble) and bobs.
  const spin = Math.cos(frame / 6);
  const bob = Math.abs(Math.sin(frame / 12)) * -30 * u;

  return (
    <div style={{position: 'relative', width: size, height: 300 * u, margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: 18 * u}}>
        <Pill text="60% ACCURATE" color="mustard" textColor={COLORS.navy} u={u} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 90 * u,
          width: 150 * u,
          height: 150 * u,
          marginLeft: -75 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.mustard,
          boxShadow: boxShadow('mustard'),
          transform: `translateY(${bob}px) scaleX(${spin})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 70 * u,
          color: COLORS.navy,
        }}
      >
        {spin >= 0 ? '?' : ''}
      </div>
      {/* Ground shadow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 270 * u,
          width: 150 * u,
          height: 22 * u,
          marginLeft: -75 * u,
          borderRadius: '50%',
          backgroundColor: SHADOW_TONES.cream,
        }}
      />
    </div>
  );
};

/**
 * Animated prop layer that ACTS OUT the scene's narration. One action per
 * scene; the engine centers it on the stage. This is what keeps every
 * scene moving — characters react, the action explains. Card scenes
 * (ScienceCard/TakeawayCard/OutroCard) get a compact action below the card.
 */
export const ActionLayer: React.FC<ActionLayerProps> = ({action, size = 600}) => {
  switch (action) {
    case 'scroll':
      return <Scroll size={size} />;
    case 'burst':
      return <Burst size={size} />;
    case 'loop':
      return <Loop size={size} />;
    case 'barrier':
      return <Barrier size={size} />;
    case 'slotMachine':
      return <SlotMachine size={size} />;
    case 'wave':
      return <Wave size={size} />;
    case 'dragAway':
      return <DragAway size={size} />;
    case 'chart':
      return <Chart size={size} />;
    case 'freeChoice':
      return <FreeChoice size={size} />;
    case 'readiness':
      return <Readiness size={size} />;
    case 'backstage':
      return <Backstage size={size} />;
    case 'coinFlip':
      return <CoinFlip size={size} />;
  }
};
