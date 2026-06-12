import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SHADOW_TONES, SPRINGS, boxShadow} from '../design-system';
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

/**
 * Animated prop layer that ACTS OUT the scene's narration. One action per
 * scene; the engine centers it on the stage. This is what keeps every
 * scene moving — characters react, the action explains.
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
  }
};
