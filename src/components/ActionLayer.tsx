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

/** A tiny round creature face used by the rank/connection actions. */
const Face: React.FC<{u: number; mood: 'calm' | 'worried'}> = ({u, mood}) => (
  <>
    {[-1, 1].map((s) => (
      <div
        key={s}
        style={{
          position: 'absolute',
          left: `calc(50% + ${s * 20 * u}px - ${7 * u}px)`,
          top: 38 * u,
          width: 14 * u,
          height: 14 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.navy,
        }}
      />
    ))}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: mood === 'worried' ? 64 * u : 60 * u,
        transform: 'translateX(-50%)',
        width: mood === 'worried' ? 22 * u : 34 * u,
        height: mood === 'worried' ? 22 * u : 16 * u,
        borderRadius:
          mood === 'worried' ? '50%' : `0 0 ${34 * u}px ${34 * u}px`,
        backgroundColor: COLORS.navy,
      }}
    />
  </>
);

/** Rank ladder: three creatures on ascending pillars. The bottom-rank
 * one (short pillar, coral) trembles and sweats; the top-rank one (tall
 * pillar, teal) wears a crown. Acts out "your rank sets your stress." */
const Hierarchy: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;
  const pillarW = 128 * u;
  const gap = 40 * u;
  const baseY = size * 0.8;
  const tiers = [
    {color: 'coral' as BrandColor, label: 'LOW', h: 130 * u, stressed: true},
    {color: 'teal' as BrandColor, label: 'MID', h: 220 * u, stressed: false},
    {color: 'teal' as BrandColor, label: 'TOP', h: 310 * u, stressed: false, crown: true},
  ];
  const totalW = tiers.length * pillarW + (tiers.length - 1) * gap;
  const startX = (size - totalW) / 2;
  const cSize = 92 * u;

  return (
    <div style={{position: 'relative', width: size, height: size, margin: '0 auto'}}>
      {tiers.map((t, i) => {
        const rise = spring({frame: frame - 6 - i * 5, fps, config: SPRINGS.bouncy, durationInFrames: 22});
        const x = startX + i * (pillarW + gap);
        const top = baseY - t.h;
        const tremble = t.stressed ? Math.sin(frame * 1.8) * 5 * u : 0;
        return (
          <React.Fragment key={i}>
            {/* pillar */}
            <div
              style={{
                position: 'absolute',
                left: x,
                top,
                width: pillarW,
                height: t.h,
                backgroundColor: COLORS.navy,
                boxShadow: boxShadow('navy'),
                borderRadius: `${24 * u}px ${24 * u}px 0 0`,
                transform: `scaleY(${rise})`,
                transformOrigin: '50% 100%',
              }}
            />
            {/* creature on top */}
            <div
              style={{
                position: 'absolute',
                left: x + pillarW / 2 - cSize / 2 + tremble,
                top: top - cSize - 8 * u,
                width: cSize,
                height: cSize,
                borderRadius: '50%',
                backgroundColor: COLORS[t.color],
                boxShadow: boxShadow(t.color),
                transform: `scale(${rise})`,
                transformOrigin: '50% 100%',
              }}
            >
              <Face u={u} mood={t.stressed ? 'worried' : 'calm'} />
              {t.crown && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: -28 * u,
                    transform: 'translateX(-50%)',
                    width: 56 * u,
                    height: 32 * u,
                    backgroundColor: COLORS.mustard,
                    clipPath:
                      'polygon(0% 100%, 0% 30%, 25% 55%, 50% 0%, 75% 55%, 100% 30%, 100% 100%)',
                  }}
                />
              )}
            </div>
            {/* sweat drop on the stressed one */}
            {t.stressed && (
              <div
                style={{
                  position: 'absolute',
                  left: x + pillarW / 2 + 34 * u,
                  top: top - cSize + 14 * u + Math.abs(Math.sin(frame / 8)) * 14 * u,
                  width: 18 * u,
                  height: 26 * u,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  backgroundColor: COLORS.teal,
                }}
              />
            )}
            {/* rank label */}
            <Pill
              text={t.label}
              color={t.stressed ? 'coral' : 'navy'}
              u={u}
              style={{position: 'absolute', left: x + pillarW / 2 - 44 * u, top: baseY + 16 * u}}
            />
          </React.Fragment>
        );
      })}
      {/* floor */}
      <div
        style={{
          position: 'absolute',
          left: startX - 20 * u,
          top: baseY,
          width: totalW + 40 * u,
          height: 14 * u,
          borderRadius: 14 * u,
          backgroundColor: COLORS.navy,
        }}
      />
    </div>
  );
};

/** Bar chart where cortisol RISES as social rank falls — the low-rank bar
 * is tallest and pulses. Quantitative science visual. */
const RankChart: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;
  const bars = [
    {label: 'HIGH', h: 0.35},
    {label: 'MID', h: 0.6},
    {label: 'LOW', h: 1.0, peak: true},
  ];
  const maxH = 280 * u;
  const barW = 88 * u;
  const gap = 34 * u;
  const chartW = bars.length * barW + (bars.length - 1) * gap;

  return (
    <div style={{position: 'relative', width: chartW, margin: '0 auto'}}>
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
        CORTISOL
      </div>
      <div style={{position: 'relative', height: maxH, display: 'flex', gap, alignItems: 'flex-end'}}>
        {bars.map((bar, i) => {
          const rise = spring({frame: frame - 6 - i * 6, fps, config: SPRINGS.bouncy, durationInFrames: 24});
          const pulse = bar.peak ? 1 + Math.sin(frame / 8) * 0.05 : 1;
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
      </div>
      <div style={{height: 16 * u, borderRadius: 16 * u, backgroundColor: COLORS.navy, margin: `${14 * u}px 0`}} />
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
        SOCIAL RANK
      </div>
    </div>
  );
};

/** Two creatures slide together; a warm pulse blooms and the stressed one
 * calms. Acts out "connection turns the alarm down." */
const Connect: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const cycle = 120;
  const p = (frame % cycle) / cycle;
  const approach = Math.min(1, p / 0.5); // come together over the first half
  const together = Math.max(0, (p - 0.5) / 0.5); // bond + calm over the second
  const cSize = 150 * u;
  const cx = size / 2;
  const leftX = cx - 210 * u + approach * 150 * u - cSize / 2;
  const rightX = cx + 210 * u - approach * 150 * u - cSize / 2;
  const tremble = (1 - approach) * Math.sin(frame * 2) * 5 * u;

  const creature = (x: number, color: BrandColor, mood: 'calm' | 'worried') => (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: size * 0.18,
        width: cSize,
        height: cSize,
        borderRadius: '50%',
        backgroundColor: COLORS[color],
        boxShadow: boxShadow(color),
      }}
    >
      <Face u={u * (cSize / (92 * u))} mood={mood} />
    </div>
  );

  return (
    <div style={{position: 'relative', width: size, height: size * 0.62, margin: '0 auto'}}>
      {/* warmth pulse once they meet */}
      {together > 0 && (
        <div
          style={{
            position: 'absolute',
            left: cx - 150 * u,
            top: size * 0.1,
            width: 300 * u,
            height: 300 * u,
            borderRadius: '50%',
            backgroundColor: COLORS.mustard,
            opacity: 0.25 * (1 - together),
            transform: `scale(${0.5 + together * 1.1})`,
          }}
        />
      )}
      {/* left: formerly stressed, calms as they bond */}
      <div style={{transform: `translateX(${tremble}px)`}}>
        {creature(leftX, 'coral', together > 0.4 ? 'calm' : 'worried')}
      </div>
      {/* right: the calm friend */}
      {creature(rightX, 'teal', 'calm')}
    </div>
  );
};

/** Red alarm rings fire outward — the amygdala blaring before thought. */
const Alarm: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const cycle = 52;
  const p = (frame % cycle) / cycle;
  const cx = size / 2;
  const cy = size * 0.42;
  const offsets = [0, 0.33, 0.66];

  return (
    <div style={{position: 'relative', width: size, height: size * 0.72, margin: '0 auto'}}>
      {/* pulsing rings */}
      {offsets.map((off, i) => {
        const rp = (p + off) % 1;
        const r = rp * size * 0.44;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx - r,
              top: cy - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              backgroundColor: COLORS.coral,
              opacity: (1 - rp) * 0.55,
            }}
          />
        );
      })}
      {/* threat spark from the right */}
      <div
        style={{
          position: 'absolute',
          right: 40 * u,
          top: cy - 30 * u,
          width: 60 * u,
          height: 60 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.mustard,
          boxShadow: boxShadow('mustard'),
          transform: `scale(${1 + Math.sin(frame / 5) * 0.28})`,
        }}
      />
      {/* alarm core */}
      <div
        style={{
          position: 'absolute',
          left: cx - 54 * u,
          top: cy - 54 * u,
          width: 108 * u,
          height: 108 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.coral,
          boxShadow: boxShadow('coral'),
          transform: `scale(${1 + Math.sin(frame / 6) * 0.12})`,
        }}
      />
    </div>
  );
};

/** Two race-tracks from the brain: the short coral FAST LANE reaches the
 * body endpoint well before the long teal SLOW LANE reaches thinking. */
const Hijack: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const cycle = 100;
  const p = (frame % cycle) / cycle;
  const cx = size / 2;
  const brainTop = 20 * u;
  const brainH = 74 * u;
  const trackTop = brainTop + brainH + 14 * u;
  const fastH = 200 * u;
  const slowH = 340 * u;
  const lx = cx - 160 * u;
  const rx = cx + 60 * u;
  const trackW = 38 * u;

  // coral dot arrives at 0.46 of cycle; teal still only 56% of its longer journey
  const fastP = Math.min(1, p / 0.46);
  const slowP = Math.min(0.56, p / 0.82);

  return (
    <div style={{position: 'relative', width: size, height: size * 0.82, margin: '0 auto'}}>
      {/* brain blob */}
      <div
        style={{
          position: 'absolute',
          left: cx - 54 * u,
          top: brainTop,
          width: 108 * u,
          height: brainH,
          borderRadius: '48% 52% 55% 45% / 55% 60% 40% 45%',
          backgroundColor: COLORS.teal,
          boxShadow: boxShadow('teal'),
          transform: `scale(${1 + Math.sin(frame / 9) * 0.04})`,
        }}
      />

      {/* fast coral track (shorter) */}
      <div style={{position: 'absolute', left: lx, top: trackTop, width: trackW, height: fastH,
        borderRadius: 20 * u, backgroundColor: SHADOW_TONES.coral}} />
      {/* slow teal track (longer) */}
      <div style={{position: 'absolute', left: rx, top: trackTop, width: trackW, height: slowH,
        borderRadius: 20 * u, backgroundColor: SHADOW_TONES.teal}} />

      {/* coral racing dot */}
      <div
        style={{
          position: 'absolute',
          left: lx + trackW / 2 - 22 * u,
          top: trackTop + fastP * fastH - 22 * u,
          width: 44 * u,
          height: 44 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.coral,
          boxShadow: boxShadow('coral'),
        }}
      />
      {/* teal racing dot */}
      <div
        style={{
          position: 'absolute',
          left: rx + trackW / 2 - 22 * u,
          top: trackTop + slowP * slowH - 22 * u,
          width: 44 * u,
          height: 44 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.teal,
          boxShadow: boxShadow('teal'),
        }}
      />

      {/* BODY endpoint (coral, lit when fast dot arrives) */}
      <div
        style={{
          position: 'absolute',
          left: lx - 14 * u,
          top: trackTop + fastH + 8 * u,
          width: 66 * u,
          height: 66 * u,
          borderRadius: '50%',
          backgroundColor: fastP >= 1 ? COLORS.coral : SHADOW_TONES.cream,
          boxShadow: fastP >= 1 ? boxShadow('coral') : undefined,
          transform: `scale(${fastP >= 1 ? 1 + Math.sin(frame / 5) * 0.1 : 1})`,
        }}
      />
      {/* THINK endpoint (teal, dim since the dot hasn't arrived) */}
      <div
        style={{
          position: 'absolute',
          left: rx - 14 * u,
          top: trackTop + slowH + 8 * u,
          width: 66 * u,
          height: 66 * u,
          borderRadius: '50%',
          backgroundColor: SHADOW_TONES.cream,
        }}
      />

      {/* labels */}
      <Pill text="FAST" color="coral" u={u}
        style={{position: 'absolute', left: lx - 10 * u, top: trackTop - 52 * u}} />
      <Pill text="SLOW" color="teal" u={u}
        style={{position: 'absolute', left: rx - 10 * u, top: trackTop - 52 * u}} />
      <Pill text="BODY" color="coral" u={u}
        style={{position: 'absolute', left: lx - 18 * u, top: trackTop + fastH + 82 * u}} />
      <Pill text="THINK" color="navy" u={u}
        style={{position: 'absolute', left: rx - 24 * u, top: trackTop + slowH + 82 * u}} />
    </div>
  );
};

/** Emotion label drops onto the alarm core; red rings shrink, a calm teal
 * ring blooms. Acts out "naming the feeling turns the amygdala down." */
const LabelTame: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;
  const cycle = 88;
  const p = (frame % cycle) / cycle;
  const cx = size / 2;
  const cy = size * 0.4;

  const labelIn = spring({
    frame: (frame % cycle) - cycle * 0.28,
    fps,
    config: SPRINGS.bouncy,
    durationInFrames: 18,
  });
  const labeled = p > 0.42;
  const alarmAlpha = labeled ? Math.max(0, 1 - (p - 0.42) / 0.28) : 1;
  const calmScale = labeled ? Math.min(1, (p - 0.42) / 0.38) : 0;
  const offsets = [0, 0.33, 0.66];

  return (
    <div style={{position: 'relative', width: size, height: size * 0.72, margin: '0 auto'}}>
      {/* alarm rings (fade after label lands) */}
      {offsets.map((off, i) => {
        const rp = ((p * 1.5 + off) % 1);
        const r = rp * size * 0.38;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx - r,
              top: cy - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              backgroundColor: COLORS.coral,
              opacity: (1 - rp) * alarmAlpha * 0.55,
            }}
          />
        );
      })}
      {/* calm teal ring blooms after labeling */}
      {calmScale > 0 && (
        <div
          style={{
            position: 'absolute',
            left: cx - 190 * u * calmScale,
            top: cy - 190 * u * calmScale,
            width: 380 * u * calmScale,
            height: 380 * u * calmScale,
            borderRadius: '50%',
            backgroundColor: COLORS.teal,
            opacity: 0.28 * (1 - calmScale * 0.6),
          }}
        />
      )}
      {/* alarm/calm core */}
      <div
        style={{
          position: 'absolute',
          left: cx - 52 * u,
          top: cy - 52 * u,
          width: 104 * u,
          height: 104 * u,
          borderRadius: '50%',
          backgroundColor: labeled ? COLORS.teal : COLORS.coral,
          boxShadow: boxShadow(labeled ? 'teal' : 'coral'),
          transform: `scale(${labeled ? 0.82 : 1 + Math.sin(frame / 6) * 0.12})`,
        }}
      />
      {/* ANGRY label dropping in */}
      <div
        style={{
          position: 'absolute',
          left: cx - 80 * u,
          top: cy - 118 * u - (1 - labelIn) * 180 * u,
          transform: `scale(${labelIn})`,
          transformOrigin: '50% 100%',
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.mustard,
            borderRadius: 999,
            boxShadow: boxShadow('mustard'),
            padding: `${14 * u}px ${28 * u}px`,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 30 * u,
            color: COLORS.navy,
            whiteSpace: 'nowrap',
          }}
        >
          ANGRY
        </div>
      </div>
    </div>
  );
};

/** Navy file drawer; a krem memory card rises out, glows with mustard halo
 * (editable!), gains a small teal detail dot, then slides back down and re-files.
 * Acts out "recall pulls the memory out and makes it editable." */
const Recall: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;
  const cycle = 110;
  const p = (frame % cycle) / cycle;

  // 0–0.3: card rises; 0.3–0.6: glows editable; 0.6–0.85: teal dot appears; 0.85–1: re-files
  const riseP = Math.min(1, p / 0.28);
  const glowP = p > 0.28 && p < 0.82 ? Math.sin(((p - 0.28) / 0.54) * Math.PI) : 0;
  const dotP = p > 0.55 ? spring({frame: (frame % cycle) - cycle * 0.55, fps, config: SPRINGS.bouncy, durationInFrames: 14}) : 0;
  const refileP = p > 0.84 ? (p - 0.84) / 0.16 : 0;

  const drawerH = 120 * u;
  const cardW = 260 * u;
  const cardH = 160 * u;
  const cx = size / 2;
  const drawerY = size * 0.55;
  const cardY = drawerY - cardH - 30 * u - riseP * 180 * u + refileP * 210 * u;

  return (
    <div style={{position: 'relative', width: size, height: size * 0.78, margin: '0 auto'}}>
      {/* mustard glow halo behind card */}
      {glowP > 0 && (
        <div
          style={{
            position: 'absolute',
            left: cx - (cardW / 2 + 28 * u),
            top: cardY - 24 * u,
            width: cardW + 56 * u,
            height: cardH + 48 * u,
            borderRadius: 40 * u,
            backgroundColor: COLORS.mustard,
            opacity: glowP * 0.45,
          }}
        />
      )}
      {/* memory card */}
      <div
        style={{
          position: 'absolute',
          left: cx - cardW / 2,
          top: cardY,
          width: cardW,
          height: cardH,
          borderRadius: 28 * u,
          backgroundColor: COLORS.cream,
          boxShadow: boxShadow('cream'),
          transform: `rotate(${Math.sin(frame / 9) * glowP * 3}deg)`,
        }}
      >
        {/* three faint lines representing stored content */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 24 * u,
              top: 32 * u + i * 36 * u,
              width: [160, 120, 80][i] * u,
              height: 14 * u,
              borderRadius: 14 * u,
              backgroundColor: SHADOW_TONES.cream,
            }}
          />
        ))}
        {/* teal detail dot (new calmer detail being added) */}
        {dotP > 0 && (
          <div
            style={{
              position: 'absolute',
              right: 24 * u,
              bottom: 24 * u,
              width: 34 * u,
              height: 34 * u,
              borderRadius: '50%',
              backgroundColor: COLORS.teal,
              boxShadow: boxShadow('teal'),
              transform: `scale(${dotP})`,
            }}
          />
        )}
      </div>
      {/* navy file drawer */}
      <div
        style={{
          position: 'absolute',
          left: cx - 180 * u,
          top: drawerY,
          width: 360 * u,
          height: drawerH,
          borderRadius: 24 * u,
          backgroundColor: COLORS.navy,
          boxShadow: boxShadow('navy'),
        }}
      >
        {/* drawer handle */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 22 * u,
            transform: 'translateX(-50%)',
            width: 80 * u,
            height: 20 * u,
            borderRadius: 20 * u,
            backgroundColor: COLORS.mustard,
          }}
        />
      </div>
    </div>
  );
};

/** Three memory cards in a row: each is a copy of the previous,
 * but tilted more and hue-shifted toward teal — the photocopy of a photocopy.
 * Acts out "recall it enough and it drifts far from what really happened." */
const Drift: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const cardW = 220 * u;
  const cardH = 150 * u;
  const gap = 40 * u;
  const totalW = 3 * cardW + 2 * gap;
  const startX = (size - totalW) / 2;
  const cardY = size * 0.18;

  // Each card bobs at a slightly offset phase
  const cards = [
    {tilt: 0, color: COLORS.coral, shadowColor: 'coral' as BrandColor, label: 'ORIGINAL', fade: 0},
    {tilt: 8, color: COLORS.mustard, shadowColor: 'mustard' as BrandColor, label: 'RECALLED', fade: 0.15},
    {tilt: 18, color: COLORS.teal, shadowColor: 'teal' as BrandColor, label: 'DRIFTED', fade: 0.35},
  ];

  return (
    <div style={{position: 'relative', width: size, height: size * 0.65, margin: '0 auto'}}>
      {cards.map((c, i) => {
        const bob = Math.sin(frame / 10 + i * 1.1) * 6 * u;
        const x = startX + i * (cardW + gap);
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                left: x,
                top: cardY + bob,
                width: cardW,
                height: cardH,
                borderRadius: 28 * u,
                backgroundColor: c.color,
                boxShadow: boxShadow(c.shadowColor),
                opacity: 1 - c.fade,
                transform: `rotate(${c.tilt + Math.sin(frame / 14 + i) * 1.5}deg)`,
                transformOrigin: '50% 100%',
              }}
            >
              {/* content lines */}
              {[0, 1].map((li) => (
                <div
                  key={li}
                  style={{
                    position: 'absolute',
                    left: 18 * u,
                    top: 28 * u + li * 34 * u,
                    width: (120 - i * 30) * u,
                    height: 12 * u,
                    borderRadius: 12 * u,
                    backgroundColor: 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
            {/* arrow between cards */}
            {i < 2 && (
              <div
                style={{
                  position: 'absolute',
                  left: x + cardW + 10 * u,
                  top: cardY + cardH / 2 - 10 * u,
                  width: gap - 20 * u,
                  height: 20 * u,
                  borderRadius: 20 * u,
                  backgroundColor: SHADOW_TONES.cream,
                }}
              />
            )}
            <Pill
              text={c.label}
              color={c.shadowColor}
              u={u}
              style={{
                position: 'absolute',
                left: x + cardW / 2 - 60 * u,
                top: cardY + cardH + 20 * u,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/** Memory card with a padlock: the lock springs open → card glows LABILE
 * (mustard) and wobbles → lock snaps shut (re-saved). Cycles. Acts out
 * reconsolidation: recall → labile → re-stored. */
const Reconsolidate: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;
  const cycle = 120;
  const p = (frame % cycle) / cycle;

  // Phase 0–0.25: locked; 0.25–0.5: lock springs open; 0.5–0.75: LABILE glowing; 0.75–1: lock snaps shut
  const unlockP = p > 0.22 && p < 0.52
    ? spring({frame: (frame % cycle) - cycle * 0.22, fps, config: SPRINGS.bouncy, durationInFrames: 16})
    : p >= 0.52 ? 1 : 0;
  const labileP = p > 0.45 && p < 0.78 ? Math.sin(((p - 0.45) / 0.33) * Math.PI) : 0;
  const relockP = p > 0.74
    ? spring({frame: (frame % cycle) - cycle * 0.74, fps, config: SPRINGS.bouncy, durationInFrames: 16})
    : 0;
  const locked = relockP > 0.5;

  const cx = size / 2;
  const cardW = 280 * u;
  const cardH = 170 * u;
  const cardX = cx - cardW / 2;
  const cardY = size * 0.22;

  // Lock shackle rises when unlocking
  const shackleUp = unlockP * 40 * u * (locked ? 0 : 1);

  return (
    <div style={{position: 'relative', width: size, height: size * 0.75, margin: '0 auto'}}>
      {/* labile glow */}
      {labileP > 0 && (
        <div
          style={{
            position: 'absolute',
            left: cardX - 32 * u,
            top: cardY - 28 * u,
            width: cardW + 64 * u,
            height: cardH + 56 * u,
            borderRadius: 40 * u,
            backgroundColor: COLORS.mustard,
            opacity: labileP * 0.5,
          }}
        />
      )}
      {/* memory card */}
      <div
        style={{
          position: 'absolute',
          left: cardX,
          top: cardY,
          width: cardW,
          height: cardH,
          borderRadius: 28 * u,
          backgroundColor: labileP > 0.1 ? COLORS.mustard : COLORS.cream,
          boxShadow: boxShadow(labileP > 0.1 ? 'mustard' : 'cream'),
          transform: `rotate(${Math.sin(frame / 8) * labileP * 5}deg)`,
        }}
      >
        {/* LABILE label appears when open */}
        {labileP > 0.3 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${labileP})`,
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontSize: 36 * u,
              color: COLORS.navy,
              whiteSpace: 'nowrap',
              letterSpacing: 3,
            }}
          >
            EDITABLE
          </div>
        )}
      </div>
      {/* padlock body */}
      <div
        style={{
          position: 'absolute',
          left: cx - 56 * u,
          top: cardY - 40 * u,
          width: 112 * u,
          height: 90 * u,
          borderRadius: 22 * u,
          backgroundColor: locked || relockP > 0 ? COLORS.navy : COLORS.teal,
          boxShadow: boxShadow(locked || relockP > 0 ? 'navy' : 'teal'),
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '40%',
            transform: 'translateX(-50%)',
            width: 20 * u,
            height: 28 * u,
            borderRadius: 10 * u,
            backgroundColor: COLORS.cream,
          }}
        />
      </div>
      {/* padlock shackle (U-shape top, rises when open) */}
      <div
        style={{
          position: 'absolute',
          left: cx - 38 * u,
          top: cardY - 80 * u - shackleUp,
          width: 76 * u,
          height: 56 * u,
          borderRadius: `${38 * u}px ${38 * u}px 0 0`,
          backgroundColor: locked || relockP > 0 ? COLORS.navy : COLORS.teal,
          boxShadow: locked || relockP > 0 ? boxShadow('navy') : boxShadow('teal'),
        }}
      />
      {/* status pill */}
      <Pill
        text={labileP > 0.3 ? 'LABILE' : locked ? 'STORED' : 'OPEN'}
        color={labileP > 0.3 ? 'mustard' : locked ? 'navy' : 'teal'}
        u={u}
        style={{
          position: 'absolute',
          left: cx - 60 * u,
          top: cardY + cardH + 20 * u,
        }}
      />
    </div>
  );
};

/** GAS pedal floored (coral, vibrating, thrill spark above) next to a
 * half-built BRAKE pedal wrapped in mustard scaffolding (teal, barely moving).
 * Acts out "the gas is floored but the brakes are still being installed." */
const GasBrakes: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const cx = size / 2;
  const floorY = size * 0.66;
  const pedalW = 180 * u;
  const gasX = cx - pedalW - 40 * u;
  const brakeX = cx + 40 * u;

  // Gas is floored and vibrating; brake is short and steady.
  const gasPress = 1; // fully down
  const jitter = Math.sin(frame * 1.6) * 4 * u;
  const gasH = 70 * u; // pressed flat
  const brakeBuilt = 0.45; // only partly built
  const brakeH = 150 * u * brakeBuilt;

  // thrill spark cycle above the gas
  const sparkP = (frame % 30) / 30;

  return (
    <div style={{position: 'relative', width: size, height: size * 0.8, margin: '0 auto'}}>
      {/* floor */}
      <div
        style={{
          position: 'absolute',
          left: gasX - 30 * u,
          top: floorY,
          width: pedalW * 2 + 140 * u,
          height: 16 * u,
          borderRadius: 16 * u,
          backgroundColor: COLORS.navy,
        }}
      />

      {/* thrill spark above gas */}
      <div
        style={{
          position: 'absolute',
          left: gasX + pedalW / 2 - 22 * u + jitter,
          top: floorY - gasH - 80 * u - sparkP * 60 * u,
          width: 44 * u,
          height: 44 * u,
          borderRadius: '50%',
          backgroundColor: COLORS.coral,
          opacity: 1 - sparkP,
        }}
      />

      {/* GAS pedal: floored, vibrating */}
      <div
        style={{
          position: 'absolute',
          left: gasX + jitter,
          top: floorY - gasH,
          width: pedalW,
          height: gasH,
          borderRadius: 24 * u,
          backgroundColor: COLORS.coral,
          boxShadow: boxShadow('coral'),
          transform: `scaleY(${gasPress})`,
          transformOrigin: '50% 100%',
        }}
      />

      {/* BRAKE pedal: short, under construction */}
      <div
        style={{
          position: 'absolute',
          left: brakeX,
          top: floorY - brakeH,
          width: pedalW,
          height: brakeH,
          borderRadius: 24 * u,
          backgroundColor: COLORS.teal,
          boxShadow: boxShadow('teal'),
        }}
      />
      {/* scaffolding bars across the unfinished brake */}
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: brakeX - 12 * u,
            top: floorY - brakeH - 30 * u - i * 34 * u,
            width: pedalW + 24 * u,
            height: 14 * u,
            borderRadius: 14 * u,
            backgroundColor: COLORS.mustard,
            transform: `rotate(${i % 2 === 0 ? -4 : 4}deg)`,
          }}
        />
      ))}

      {/* labels */}
      <Pill
        text="GAS"
        color="coral"
        u={u}
        style={{position: 'absolute', left: gasX + pedalW / 2 - 36 * u, top: floorY + 28 * u}}
      />
      <Pill
        text="BRAKE"
        color="teal"
        u={u}
        style={{position: 'absolute', left: brakeX + pedalW / 2 - 48 * u, top: floorY + 28 * u}}
      />
    </div>
  );
};

/** Teal brain whose FRONT (behind the forehead) is wrapped in mustard
 * scaffolding with a little navy crane swinging; the back glows finished.
 * Acts out "the judgment part is the last to finish wiring." */
const Construction: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;
  const cx = size / 2;
  const cy = size * 0.42;
  const brainW = 320 * u;
  const brainH = 250 * u;

  const craneSwing = Math.sin(frame / 12) * 14;

  return (
    <div style={{position: 'relative', width: size, height: size * 0.78, margin: '0 auto'}}>
      {/* brain blob */}
      <div
        style={{
          position: 'absolute',
          left: cx - brainW / 2,
          top: cy - brainH / 2,
          width: brainW,
          height: brainH,
          borderRadius: '48% 52% 55% 45% / 58% 60% 40% 42%',
          backgroundColor: COLORS.teal,
          boxShadow: boxShadow('teal'),
          transform: `scale(${1 + Math.sin(frame / 10) * 0.02})`,
        }}
      />
      {/* "front / forehead" patch under construction (right side) */}
      <div
        style={{
          position: 'absolute',
          left: cx + 24 * u,
          top: cy - brainH / 2 + 20 * u,
          width: brainW * 0.42,
          height: brainH * 0.66,
          borderRadius: `${30 * u}px ${60 * u}px ${60 * u}px ${30 * u}px`,
          backgroundColor: SHADOW_TONES.teal,
        }}
      />
      {/* scaffolding poles over the front patch */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: cx + 36 * u + i * 40 * u,
            top: cy - brainH / 2 + 24 * u,
            width: 12 * u,
            height: brainH * 0.6,
            borderRadius: 12 * u,
            backgroundColor: COLORS.mustard,
          }}
        />
      ))}
      {[0, 1].map((i) => (
        <div
          key={`h-${i}`}
          style={{
            position: 'absolute',
            left: cx + 30 * u,
            top: cy - brainH / 2 + 40 * u + i * 70 * u,
            width: 130 * u,
            height: 12 * u,
            borderRadius: 12 * u,
            backgroundColor: COLORS.mustard,
          }}
        />
      ))}

      {/* crane: vertical mast + swinging arm with a hanging block */}
      <div
        style={{
          position: 'absolute',
          left: cx + brainW / 2 - 6 * u,
          top: cy - brainH / 2 - 120 * u,
          width: 14 * u,
          height: 170 * u,
          borderRadius: 14 * u,
          backgroundColor: COLORS.navy,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: cx + brainW / 2 - 6 * u,
          top: cy - brainH / 2 - 120 * u,
          width: 120 * u,
          height: 14 * u,
          borderRadius: 14 * u,
          backgroundColor: COLORS.navy,
          transformOrigin: '0% 50%',
          transform: `rotate(${craneSwing}deg)`,
        }}
      >
        {/* hanging block */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 14 * u,
            width: 40 * u,
            height: 40 * u,
            borderRadius: 10 * u,
            backgroundColor: COLORS.coral,
            boxShadow: boxShadow('coral'),
          }}
        />
      </div>

      {/* WIRING pill */}
      <Pill
        text="WIRING…"
        color="mustard"
        textColor={COLORS.navy}
        u={u}
        style={{position: 'absolute', left: cx + 30 * u, top: cy + brainH / 2 + 14 * u}}
      />
    </div>
  );
};

/** A 0→25 age axis; a playhead sweeps left to right and a fill bar follows.
 * A brain icon at the far right (the prefrontal) only fills in when the
 * sweep reaches ~25. Acts out "the brakes finish wiring in your mid-twenties." */
const Maturation: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;
  const cycle = 150;
  const p = (frame % cycle) / cycle;
  const trackW = size * 0.82;
  const startX = (size - trackW) / 2;
  const trackY = size * 0.42;

  const sweep = Math.min(1, p / 0.75); // reach the end by 75%, then hold
  const headX = startX + sweep * trackW;
  const done = sweep >= 0.99;
  const brainPop = done
    ? spring({frame: (frame % cycle) - cycle * 0.75, fps, config: SPRINGS.bouncy, durationInFrames: 18})
    : 0;

  const ticks = [
    {label: '0', at: 0},
    {label: '10', at: 0.4},
    {label: '18', at: 0.72},
    {label: '25', at: 1},
  ];

  return (
    <div style={{position: 'relative', width: size, height: size * 0.7, margin: '0 auto'}}>
      {/* headline */}
      <div
        style={{
          position: 'absolute',
          top: trackY - 110 * u,
          left: 0,
          width: size,
          textAlign: 'center',
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 34 * u,
          letterSpacing: 3,
          color: COLORS.navy,
        }}
      >
        BRAIN WIRING
      </div>

      {/* base track */}
      <div
        style={{
          position: 'absolute',
          left: startX,
          top: trackY,
          width: trackW,
          height: 26 * u,
          borderRadius: 26 * u,
          backgroundColor: SHADOW_TONES.cream,
        }}
      />
      {/* fill */}
      <div
        style={{
          position: 'absolute',
          left: startX,
          top: trackY,
          width: Math.max(0, headX - startX),
          height: 26 * u,
          borderRadius: 26 * u,
          backgroundColor: COLORS.teal,
        }}
      />
      {/* playhead */}
      <div
        style={{
          position: 'absolute',
          left: headX - 6 * u,
          top: trackY - 18 * u,
          width: 12 * u,
          height: 62 * u,
          borderRadius: 12 * u,
          backgroundColor: COLORS.mustard,
        }}
      />

      {/* age ticks */}
      {ticks.map((t, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: startX + t.at * trackW - 18 * u,
            top: trackY + 40 * u,
            width: 36 * u,
            textAlign: 'center',
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 30 * u,
            color: t.label === '25' ? COLORS.coral : COLORS.navy,
          }}
        >
          {t.label}
        </div>
      ))}

      {/* prefrontal brain at the end, fills in only at 25 */}
      <div
        style={{
          position: 'absolute',
          left: startX + trackW - 50 * u,
          top: trackY - 150 * u,
          width: 100 * u,
          height: 84 * u,
          borderRadius: '48% 52% 55% 45% / 58% 60% 40% 42%',
          backgroundColor: brainPop > 0.1 ? COLORS.teal : SHADOW_TONES.cream,
          boxShadow: brainPop > 0.1 ? boxShadow('teal') : undefined,
          transform: `scale(${0.7 + brainPop * 0.3})`,
        }}
      />
      {done && (
        <Pill
          text="BRAKES READY"
          color="coral"
          u={u}
          style={{
            position: 'absolute',
            left: startX + trackW - 130 * u,
            top: trackY - 210 * u,
            transform: `scale(${brainPop})`,
          }}
        />
      )}
    </div>
  );
};

/** 5–6 teal dots cluster tightly (the in-group); a navy ring surrounds them.
 * A lone coral dot outside the ring gets nudged further away with a spring.
 * Acts out "the same glue draws a line — outsiders get pushed further." */
const InGroup: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;

  const cx = size / 2;
  const cy = size * 0.46;
  const ringR = 140 * u;
  const dotD = 56 * u;

  // Cluster breathes gently
  const breath = Math.sin(frame / 18) * 6 * u;

  // Outsider drifts further over time then resets
  const cycle = 80;
  const t = (frame % cycle) / cycle;
  const outsiderPush = spring({
    frame: (frame % cycle),
    fps,
    config: SPRINGS.gentle,
    durationInFrames: 30,
  });
  const outsiderX = cx + (ringR + 60 * u + outsiderPush * 70 * u);
  const outsiderY = cy - 20 * u;

  // Inner group positions (pentagon + center)
  const innerPositions = [
    {x: 0, y: 0},
    ...Array.from({length: 5}).map((_, i) => {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      return {x: Math.cos(a) * 70 * u, y: Math.sin(a) * 70 * u};
    }),
  ];

  return (
    <div style={{position: 'relative', width: size, height: size * 0.9, margin: '0 auto'}}>
      {/* Navy ring — made from two concentric circles */}
      <div style={{
        position: 'absolute',
        left: cx - ringR - 22 * u,
        top: cy - ringR - 22 * u,
        width: (ringR + 22 * u) * 2,
        height: (ringR + 22 * u) * 2,
        borderRadius: '50%',
        backgroundColor: COLORS.navy,
        boxShadow: boxShadow('navy'),
      }} />
      <div style={{
        position: 'absolute',
        left: cx - ringR + 8 * u,
        top: cy - ringR + 8 * u,
        width: (ringR - 8 * u) * 2,
        height: (ringR - 8 * u) * 2,
        borderRadius: '50%',
        backgroundColor: COLORS.cream,
      }} />

      {/* Inner group dots */}
      {innerPositions.map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: cx + pos.x + breath - dotD / 2,
          top: cy + pos.y + breath * 0.5 - dotD / 2,
          width: dotD,
          height: dotD,
          borderRadius: '50%',
          backgroundColor: COLORS.teal,
          boxShadow: boxShadow('teal'),
        }} />
      ))}

      {/* Outsider dot — coral, pushed further right */}
      <div style={{
        position: 'absolute',
        left: outsiderX - dotD * 0.5,
        top: outsiderY - dotD * 0.5,
        width: dotD,
        height: dotD,
        borderRadius: '50%',
        backgroundColor: COLORS.coral,
        boxShadow: boxShadow('coral'),
        transform: `scale(${interpolate(outsiderPush, [0, 1], [1, 0.72])})`,
      }} />

      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: 16 * u,
        left: 0, right: 0,
        textAlign: 'center',
        fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 28 * u, color: COLORS.navy,
      }}>SAME CHEMICAL, DIFFERENT EFFECT</div>
    </div>
  );
};

/** The navy boundary ring springs outward; the coral outsider dot enters,
 * turns teal, and a mustard warm pulse blooms at the center.
 * Acts out "find one thing you share — 'them' becomes 'us'." */
const WidenCircle: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;

  const cx = size / 2;
  const cy = size * 0.44;
  const cycle = 90;
  const p = (frame % cycle) / cycle;

  // Ring expands from tight to wide, then snaps back
  const expandProg = spring({
    frame: frame % cycle,
    fps,
    config: SPRINGS.bouncy,
    durationInFrames: 30,
  });
  const ringR = interpolate(expandProg, [0, 1], [110 * u, 170 * u]);
  const ringThick = 22 * u;

  // Outsider enters as ring widens
  const outsiderStart = cx + 220 * u;
  const outsiderTarget = cx + 60 * u;
  const outsiderX = interpolate(expandProg, [0, 1], [outsiderStart, outsiderTarget]);
  const outsiderY = cy - 10 * u;
  const dotD = 56 * u;
  const dotColor = expandProg > 0.6 ? COLORS.teal : COLORS.coral;
  const dotShadow: 'teal' | 'coral' = expandProg > 0.6 ? 'teal' : 'coral';

  // Warm pulse
  const pulseScale = 0.8 + Math.sin(frame / 12) * 0.2;

  return (
    <div style={{position: 'relative', width: size, height: size * 0.88, margin: '0 auto'}}>
      {/* Ring outer */}
      <div style={{
        position: 'absolute',
        left: cx - ringR - ringThick,
        top: cy - ringR - ringThick,
        width: (ringR + ringThick) * 2,
        height: (ringR + ringThick) * 2,
        borderRadius: '50%',
        backgroundColor: COLORS.navy,
        boxShadow: boxShadow('navy'),
      }} />
      {/* Ring inner cutout (cream) */}
      <div style={{
        position: 'absolute',
        left: cx - ringR,
        top: cy - ringR,
        width: ringR * 2,
        height: ringR * 2,
        borderRadius: '50%',
        backgroundColor: COLORS.cream,
      }} />

      {/* Warm mustard pulse at center */}
      <div style={{
        position: 'absolute',
        left: cx - 44 * u * pulseScale,
        top: cy - 44 * u * pulseScale,
        width: 88 * u * pulseScale,
        height: 88 * u * pulseScale,
        borderRadius: '50%',
        backgroundColor: COLORS.mustard,
        boxShadow: boxShadow('mustard'),
        opacity: 0.5 + expandProg * 0.5,
      }} />

      {/* Inner teal dots */}
      {Array.from({length: 5}).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: cx + Math.cos(a) * 68 * u - 26 * u,
            top: cy + Math.sin(a) * 68 * u - 26 * u,
            width: 52 * u,
            height: 52 * u,
            borderRadius: '50%',
            backgroundColor: COLORS.teal,
            boxShadow: boxShadow('teal'),
          }} />
        );
      })}

      {/* Outsider dot moving in */}
      <div style={{
        position: 'absolute',
        left: outsiderX - dotD / 2,
        top: outsiderY - dotD / 2,
        width: dotD,
        height: dotD,
        borderRadius: '50%',
        backgroundColor: dotColor,
        boxShadow: boxShadow(dotShadow),
      }} />
    </div>
  );
};

/** Two-bar trust chart: tall teal "YOUR GROUP" bar vs short navy "OUTSIDERS"
 * bar. Bars spring up, labels pop in. Acts out the in-group favoritism
 * science: oxytocin raises in-group trust, not general trust. */
const GroupTrust: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;

  const barW = 180 * u;
  const maxH = 280 * u;
  const gap = 80 * u;
  const totalW = barW * 2 + gap;
  const left = (size - totalW) / 2;

  const bars = [
    {label: 'YOUR\nGROUP', h: 0.88, color: COLORS.teal, shadow: 'teal' as const},
    {label: 'OUTSIDERS', h: 0.28, color: COLORS.navy, shadow: 'navy' as const},
  ];

  return (
    <div style={{position: 'relative', width: size, height: size * 0.78, margin: '0 auto'}}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 34 * u, letterSpacing: 3,
        color: COLORS.navy, marginBottom: 24 * u,
      }}>TRUST</div>

      <div style={{position: 'relative', height: maxH + 80 * u}}>
        {/* Bars */}
        {bars.map((bar, i) => {
          const rise = spring({
            frame: frame - 6 - i * 10,
            fps,
            config: SPRINGS.bouncy,
            durationInFrames: 24,
          });
          const barH = maxH * bar.h;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: left + i * (barW + gap),
              bottom: 30 * u,
              width: barW,
              height: barH * rise,
              borderRadius: 22 * u,
              backgroundColor: bar.color,
              boxShadow: boxShadow(bar.shadow),
              transformOrigin: '50% 100%',
            }} />
          );
        })}

        {/* Baseline */}
        <div style={{
          position: 'absolute',
          left: left - 10 * u,
          bottom: 14 * u,
          width: totalW + 20 * u,
          height: 16 * u,
          borderRadius: 16 * u,
          backgroundColor: COLORS.navy,
        }} />

        {/* Labels */}
        {bars.map((bar, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: left + i * (barW + gap),
            bottom: -52 * u,
            width: barW,
            textAlign: 'center',
            fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 28 * u,
            color: bar.color,
            whiteSpace: 'pre-line',
          }}>{bar.label}</div>
        ))}
      </div>
    </div>
  );
};

/** DNA strand with 3 toggle switches; an environment icon cycles sun/cloud
 * and the toggles spring on (teal) or off (navy) to show which genes
 * "get read." Acts out "environment decides which lines get performed." */
const GeneSwitch: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;

  const cycle = 90;
  const wave = Math.sin((frame / cycle) * Math.PI * 2);
  const on = (wave + 1) / 2; // 0 = off/storm, 1 = on/sun
  const sunPhase = wave > 0;

  const strandW = size * 0.78;
  const strandLeft = (size - strandW) / 2;
  const strandH = 22 * u;
  const rungH = 76 * u;
  const topRailY = size * 0.48;
  const bottomRailY = topRailY + strandH + rungH;
  const numRungs = 7;

  // Toggle knob: pill track is 96u wide, knob 44u → range [4u, 48u]
  const knobLeft = interpolate(on, [0, 1], [4 * u, 48 * u]);
  const toggleColor = sunPhase ? COLORS.teal : COLORS.navy;
  const toggleShadowKey: 'teal' | 'navy' = sunPhase ? 'teal' : 'navy';
  const iconSize = 76 * u;
  const iconTop = 14 * u;

  return (
    <div style={{position: 'relative', width: size, height: size * 0.83, margin: '0 auto'}}>
      {/* Environment icon — sun (mustard) or cloud (navy) */}
      <div
        style={{
          position: 'absolute',
          left: size / 2 - iconSize / 2,
          top: iconTop,
          width: iconSize,
          height: sunPhase ? iconSize : iconSize * 0.65,
          borderRadius: sunPhase ? '50%' : `50% 50% 40% 40%`,
          backgroundColor: sunPhase ? COLORS.mustard : COLORS.navy,
          boxShadow: boxShadow(sunPhase ? 'mustard' : 'navy'),
          transform: `scale(${0.82 + 0.18 * on})`,
        }}
      />
      {/* Cloud: extra bump on the left and right when storm */}
      {!sunPhase && (
        <>
          <div style={{
            position: 'absolute',
            left: size / 2 - iconSize * 0.62,
            top: iconTop + iconSize * 0.12,
            width: iconSize * 0.55,
            height: iconSize * 0.55,
            borderRadius: '50%',
            backgroundColor: COLORS.navy,
          }} />
          <div style={{
            position: 'absolute',
            left: size / 2 + iconSize * 0.18,
            top: iconTop + iconSize * 0.2,
            width: iconSize * 0.42,
            height: iconSize * 0.42,
            borderRadius: '50%',
            backgroundColor: COLORS.navy,
          }} />
        </>
      )}
      {/* Label under icon */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: iconTop + iconSize + 16 * u,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        fontWeight: 900,
        fontSize: 28 * u,
        letterSpacing: 2,
        color: sunPhase ? COLORS.mustard : COLORS.navy,
      }}>
        {sunPhase ? 'NURTURING' : 'HARSH'}
      </div>

      {/* DNA top rail */}
      <div style={{
        position: 'absolute',
        left: strandLeft,
        top: topRailY,
        width: strandW,
        height: strandH,
        borderRadius: strandH,
        backgroundColor: COLORS.navy,
        boxShadow: boxShadow('navy'),
      }} />
      {/* DNA bottom rail */}
      <div style={{
        position: 'absolute',
        left: strandLeft,
        top: bottomRailY,
        width: strandW,
        height: strandH,
        borderRadius: strandH,
        backgroundColor: COLORS.navy,
        boxShadow: boxShadow('navy'),
      }} />
      {/* Rungs */}
      {Array.from({length: numRungs}).map((_, i) => {
        const rx = strandLeft + ((i + 1) / (numRungs + 1)) * strandW - 10 * u;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: rx,
            top: topRailY + strandH,
            width: 20 * u,
            height: rungH,
            borderRadius: 10 * u,
            backgroundColor: SHADOW_TONES.navy,
          }} />
        );
      })}

      {/* 3 toggle switches at 25%, 50%, 75% of strand */}
      {[0.25, 0.5, 0.75].map((frac, t) => {
        const tx = strandLeft + frac * strandW - 48 * u;
        const ty = topRailY + strandH + rungH / 2 - 26 * u;
        return (
          <div key={t} style={{
            position: 'absolute',
            left: tx,
            top: ty,
            width: 96 * u,
            height: 52 * u,
            borderRadius: 26 * u,
            backgroundColor: toggleColor,
            boxShadow: boxShadow(toggleShadowKey),
          }}>
            <div style={{
              position: 'absolute',
              left: knobLeft,
              top: 4 * u,
              width: 44 * u,
              height: 44 * u,
              borderRadius: '50%',
              backgroundColor: COLORS.cream,
            }} />
          </div>
        );
      })}
    </div>
  );
};

/** Split-screen: a teal orchid vs a mustard dandelion.
 * An environment icon cycles storm → sunshine. The orchid responds
 * dramatically (droops then blooms); the dandelion barely flinches.
 * Acts out "differential sensitivity — to stress AND to kindness." */
const OrchidDandelion: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const u = size / 600;

  const cycle = 100;
  const wave = Math.sin((frame / cycle) * Math.PI * 2);
  const sun = (wave + 1) / 2; // 0 = storm, 1 = sunshine
  const sunPhase = wave > 0;

  const halfW = size / 2;
  const flowerY = size * 0.54;
  const petalR = 68 * u; // distance from center to petal center
  const petalD = 52 * u; // petal circle diameter
  const centerD = 68 * u;
  const numPetals = 6;
  const puffR = 62 * u;
  const puffD = 32 * u;
  const numPuffs = 12;

  // Orchid reacts a lot
  const orchidScale = 0.72 + sun * 0.56;
  const orchidY = flowerY + (1 - sun) * 28 * u;
  // Dandelion barely reacts
  const dandelionScale = 0.95 + sun * 0.1;

  const iconSize = 72 * u;
  const iconTop = 14 * u;

  return (
    <div style={{position: 'relative', width: size, height: size * 0.9, margin: '0 auto'}}>
      {/* Environment icon at top center */}
      <div style={{
        position: 'absolute',
        left: size / 2 - iconSize / 2,
        top: iconTop,
        width: iconSize,
        height: sunPhase ? iconSize : iconSize * 0.65,
        borderRadius: sunPhase ? '50%' : '50% 50% 40% 40%',
        backgroundColor: sunPhase ? COLORS.mustard : COLORS.navy,
        boxShadow: boxShadow(sunPhase ? 'mustard' : 'navy'),
        transform: `scale(${0.82 + 0.18 * sun})`,
      }} />
      {!sunPhase && (
        <>
          <div style={{position:'absolute', left: size/2 - iconSize*0.6, top: iconTop + iconSize*0.1, width: iconSize*0.52, height: iconSize*0.52, borderRadius:'50%', backgroundColor: COLORS.navy}} />
          <div style={{position:'absolute', left: size/2 + iconSize*0.16, top: iconTop + iconSize*0.18, width: iconSize*0.4, height: iconSize*0.4, borderRadius:'50%', backgroundColor: COLORS.navy}} />
        </>
      )}

      {/* Divider */}
      <div style={{
        position: 'absolute',
        left: halfW - 4 * u,
        top: iconTop + iconSize + 20 * u,
        width: 8 * u,
        bottom: 40 * u,
        backgroundColor: SHADOW_TONES.cream,
        borderRadius: 4 * u,
      }} />

      {/* ORCHID — left half */}
      <div style={{position:'absolute', left:0, top:0, width:halfW, height:'100%'}}>
        {/* Flower group */}
        <div style={{
          position: 'absolute',
          left: halfW / 2,
          top: orchidY,
          transform: `translate(-50%, -50%) scale(${orchidScale})`,
        }}>
          {Array.from({length: numPetals}).map((_, i) => {
            const a = (i / numPetals) * Math.PI * 2;
            return (
              <div key={i} style={{
                position: 'absolute',
                left: Math.cos(a) * petalR - petalD / 2,
                top: Math.sin(a) * petalR - petalD / 2,
                width: petalD,
                height: petalD,
                borderRadius: '50%',
                backgroundColor: COLORS.teal,
                boxShadow: boxShadow('teal'),
              }} />
            );
          })}
          <div style={{
            position: 'absolute',
            left: -centerD / 2,
            top: -centerD / 2,
            width: centerD,
            height: centerD,
            borderRadius: '50%',
            backgroundColor: COLORS.mustard,
            boxShadow: boxShadow('mustard'),
          }} />
        </div>
        <div style={{
          position:'absolute', bottom: 14*u, left:0, right:0,
          textAlign:'center', fontFamily: FONT_FAMILY, fontWeight: 900,
          fontSize: 26*u, color: COLORS.teal,
        }}>ORCHID</div>
      </div>

      {/* DANDELION — right half */}
      <div style={{position:'absolute', left:halfW, top:0, width:halfW, height:'100%'}}>
        <div style={{
          position: 'absolute',
          left: halfW / 2,
          top: flowerY,
          transform: `translate(-50%, -50%) scale(${dandelionScale})`,
        }}>
          {Array.from({length: numPuffs}).map((_, i) => {
            const a = (i / numPuffs) * Math.PI * 2;
            return (
              <div key={i} style={{
                position: 'absolute',
                left: Math.cos(a) * puffR - puffD / 2,
                top: Math.sin(a) * puffR - puffD / 2,
                width: puffD,
                height: puffD,
                borderRadius: '50%',
                backgroundColor: COLORS.mustard,
                boxShadow: boxShadow('mustard'),
              }} />
            );
          })}
          <div style={{
            position: 'absolute',
            left: -centerD / 2,
            top: -centerD / 2,
            width: centerD,
            height: centerD,
            borderRadius: '50%',
            backgroundColor: COLORS.coral,
            boxShadow: boxShadow('coral'),
          }} />
        </div>
        <div style={{
          position:'absolute', bottom: 14*u, left:0, right:0,
          textAlign:'center', fontFamily: FONT_FAMILY, fontWeight: 900,
          fontSize: 26*u, color: COLORS.mustard,
        }}>DANDELION</div>
      </div>
    </div>
  );
};

/** Crossover line chart: X = environment quality (HARSH → NURTURING),
 * Y = outcome. A steep teal "SENSITIVE" line and a nearly flat mustard
 * "RESILIENT" line animate in progressively. Acts out the
 * differential-susceptibility crossover interaction. */
const Susceptibility: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = size / 600;

  const chartW = size * 0.80;
  const chartH = size * 0.50;
  const chartLeft = (size - chartW) / 2;
  const chartTop = size * 0.17;
  const axisThick = 14 * u;

  const drawProgress = spring({
    frame: frame - 6,
    fps,
    config: {damping: 18, stiffness: 55},
    durationInFrames: 44,
  });
  const labelIn = spring({
    frame: frame - 46,
    fps,
    config: SPRINGS.bouncy,
    durationInFrames: 16,
  });

  // Chart coordinate helpers
  const cx = (xFrac: number) => chartLeft + xFrac * chartW;
  const cy = (yFrac: number) => chartTop + chartH - yFrac * chartH;

  // Line definitions (start / end in 0-1 chart coords)
  const lines: Array<{
    start: {x: number; y: number};
    end: {x: number; y: number};
    color: string;
    shadow: 'teal' | 'mustard';
    label: string;
    labelYOffset: number;
  }> = [
    {start: {x: 0, y: 0.08}, end: {x: 1, y: 0.92}, color: COLORS.teal, shadow: 'teal', label: 'SENSITIVE', labelYOffset: -44 * u},
    {start: {x: 0, y: 0.44}, end: {x: 1, y: 0.60}, color: COLORS.mustard, shadow: 'mustard', label: 'RESILIENT', labelYOffset: 14 * u},
  ];

  const DOT_COUNT = 36;
  const DOT_SIZE = 20 * u;

  return (
    <div style={{position: 'relative', width: size, height: size * 0.85, margin: '0 auto'}}>
      {/* Y axis */}
      <div style={{
        position: 'absolute',
        left: chartLeft,
        top: chartTop,
        width: axisThick,
        height: chartH,
        borderRadius: axisThick,
        backgroundColor: COLORS.navy,
      }} />
      {/* X axis */}
      <div style={{
        position: 'absolute',
        left: chartLeft,
        top: chartTop + chartH,
        width: chartW,
        height: axisThick,
        borderRadius: axisThick,
        backgroundColor: COLORS.navy,
      }} />

      {/* X axis labels */}
      <div style={{
        position: 'absolute',
        left: chartLeft,
        top: chartTop + chartH + 24 * u,
        fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 26 * u, color: COLORS.navy,
      }}>HARSH</div>
      <div style={{
        position: 'absolute',
        right: chartLeft,
        top: chartTop + chartH + 24 * u,
        fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 26 * u, color: COLORS.navy,
        textAlign: 'right',
      }}>NURTURING</div>

      {/* Y axis label */}
      <div style={{
        position: 'absolute',
        left: chartLeft,
        top: chartTop - 44 * u,
        fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 26 * u, color: COLORS.navy,
      }}>OUTCOME ↑</div>

      {/* Lines drawn as filled dots */}
      {lines.map((line) =>
        Array.from({length: DOT_COUNT}).map((_, i) => {
          const t = i / (DOT_COUNT - 1);
          if (t > drawProgress) return null;
          const x = cx(line.start.x + (line.end.x - line.start.x) * t);
          const y = cy(line.start.y + (line.end.y - line.start.y) * t);
          return (
            <div
              key={`${line.label}-${i}`}
              style={{
                position: 'absolute',
                left: x - DOT_SIZE / 2,
                top: y - DOT_SIZE / 2,
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: '50%',
                backgroundColor: line.color,
                boxShadow: boxShadow(line.shadow),
              }}
            />
          );
        })
      )}

      {/* End-of-line labels */}
      {lines.map((line) => (
        <div
          key={`label-${line.label}`}
          style={{
            position: 'absolute',
            left: cx(line.end.x) - 120 * u,
            top: cy(line.end.y) + line.labelYOffset,
            fontFamily: FONT_FAMILY,
            fontWeight: 900,
            fontSize: 26 * u,
            color: line.color,
            transform: `scale(${labelIn})`,
            transformOrigin: 'center center',
          }}
        >
          {line.label}
        </div>
      ))}
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
    case 'hierarchy':
      return <Hierarchy size={size} />;
    case 'rankChart':
      return <RankChart size={size} />;
    case 'connect':
      return <Connect size={size} />;
    case 'alarm':
      return <Alarm size={size} />;
    case 'hijack':
      return <Hijack size={size} />;
    case 'labelTame':
      return <LabelTame size={size} />;
    case 'recall':
      return <Recall size={size} />;
    case 'drift':
      return <Drift size={size} />;
    case 'reconsolidate':
      return <Reconsolidate size={size} />;
    case 'gasBrakes':
      return <GasBrakes size={size} />;
    case 'construction':
      return <Construction size={size} />;
    case 'maturation':
      return <Maturation size={size} />;
    case 'geneSwitch':
      return <GeneSwitch size={size} />;
    case 'orchidDandelion':
      return <OrchidDandelion size={size} />;
    case 'susceptibility':
      return <Susceptibility size={size} />;
    case 'inGroup':
      return <InGroup size={size} />;
    case 'widenCircle':
      return <WidenCircle size={size} />;
    case 'groupTrust':
      return <GroupTrust size={size} />;
  }
};
