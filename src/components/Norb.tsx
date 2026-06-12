import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SHADOW_TONES, SHADOW_OFFSET, SPRINGS} from '../design-system';

export type NorbEmotion =
  | 'neutral'
  | 'panicked'
  | 'jittery'
  | 'exhausted'
  | 'curious'
  | 'lightbulb'
  | 'facepalm'
  | 'celebrating';

type NorbProps = {
  emotion?: NorbEmotion;
  /** Diameter of the body in px. */
  size?: number;
  /** Frame (relative to the enclosing Sequence) at which Norb pops in. */
  enterAt?: number;
  style?: React.CSSProperties;
};

const BODY = COLORS.coral;
const BODY_SHADOW = SHADOW_TONES.coral;
const DETAIL = COLORS.navy;

/**
 * Norbert the Neuron — round coral neuron with dendrite "hair".
 * Never speaks, only reacts. Idle wiggle is always on; the `emotion`
 * prop layers expression and motion on top.
 */
export const Norb: React.FC<NorbProps> = ({
  emotion = 'neutral',
  size = 360,
  enterAt = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Pop-in entrance (bouncy squash-and-stretch).
  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: SPRINGS.bouncy,
    durationInFrames: 30,
  });

  // Gentle idle wiggle: slow sway + breathe.
  const sway = Math.sin(frame / 13) * 3;
  const breathe = 1 + Math.sin(frame / 19) * 0.015;

  // Emotion-driven motion.
  let shakeX = 0;
  let rotate = sway;
  let bounceY = 0;
  if (emotion === 'panicked') {
    shakeX = Math.sin(frame * 2.2) * 8;
    rotate = Math.sin(frame * 1.8) * 4;
  } else if (emotion === 'jittery') {
    shakeX = Math.sin(frame * 4) * 4;
    bounceY = Math.abs(Math.sin(frame * 3)) * -6;
  } else if (emotion === 'celebrating') {
    bounceY = -Math.abs(Math.sin(frame / 4)) * 26;
  } else if (emotion === 'exhausted') {
    rotate = sway * 0.4;
    bounceY = interpolate(Math.sin(frame / 25), [-1, 1], [4, 10]);
  } else if (emotion === 'curious') {
    rotate = sway + 7;
  }

  const scale = enter * breathe;
  const u = size / 360; // scale unit so Norb draws correctly at any size

  // --- Face ----------------------------------------------------------------
  const eyeSize = emotion === 'panicked' ? 34 * u : 22 * u;
  const eyeY = emotion === 'exhausted' ? 158 * u : 145 * u;
  const eyeGap = 64 * u;

  const mouth: React.CSSProperties = (() => {
    const base: React.CSSProperties = {
      position: 'absolute',
      left: '50%',
      top: 205 * u,
      transform: 'translateX(-50%)',
      backgroundColor: DETAIL,
    };
    switch (emotion) {
      case 'panicked':
        return {...base, width: 44 * u, height: 50 * u, borderRadius: '50%'};
      case 'celebrating':
      case 'lightbulb':
        return {
          ...base,
          width: 70 * u,
          height: 36 * u,
          borderRadius: `0 0 ${70 * u}px ${70 * u}px`,
        };
      case 'exhausted':
        return {...base, width: 50 * u, height: 8 * u, borderRadius: 8 * u, top: 215 * u};
      case 'jittery':
        return {...base, width: 36 * u, height: 14 * u, borderRadius: '50%'};
      default:
        return {
          ...base,
          width: 44 * u,
          height: 22 * u,
          borderRadius: `0 0 ${44 * u}px ${44 * u}px`,
        };
    }
  })();

  // Dendrite "hair": three rounded prongs on top of the head.
  const dendrites = [
    {x: 96, h: 78, tilt: -18},
    {x: 158, h: 96, tilt: 0},
    {x: 220, h: 78, tilt: 18},
  ];

  return (
    <div
      style={{
        width: size,
        height: size * 1.25,
        position: 'relative',
        transform: `translate(${shakeX}px, ${bounceY}px) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: '50% 80%',
        ...style,
      }}
    >
      {/* Dendrite hair */}
      {dendrites.map((d, i) => {
        const wiggle = Math.sin(frame / 9 + i * 1.4) * 5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: d.x * u,
              top: 0,
              width: 44 * u,
              height: d.h * u,
              borderRadius: 24 * u,
              backgroundColor: BODY,
              boxShadow: `${SHADOW_OFFSET.x}px ${SHADOW_OFFSET.y * 0.5}px 0px ${BODY_SHADOW}`,
              transform: `rotate(${d.tilt + wiggle}deg)`,
              transformOrigin: '50% 100%',
            }}
          />
        );
      })}

      {/* Body */}
      <div
        style={{
          position: 'absolute',
          top: 60 * u,
          left: 0,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: BODY,
          boxShadow: `${SHADOW_OFFSET.x}px ${SHADOW_OFFSET.y}px 0px ${BODY_SHADOW}`,
        }}
      >
        {/* Eyes (simple dots) */}
        {[-1, 1].map((side) => (
          <div
            key={side}
            style={{
              position: 'absolute',
              left: `calc(50% + ${(side * eyeGap) / 2}px - ${eyeSize / 2}px)`,
              top: eyeY - 60 * u,
              width: eyeSize,
              height: eyeSize,
              borderRadius: '50%',
              backgroundColor: DETAIL,
              // Exhausted: half-closed lids via flattening.
              transform: emotion === 'exhausted' ? 'scaleY(0.35)' : undefined,
            }}
          />
        ))}

        {/* Curious: one raised brow */}
        {emotion === 'curious' && (
          <div
            style={{
              position: 'absolute',
              left: `calc(50% + ${eyeGap / 2}px - ${26 * u}px)`,
              top: eyeY - 100 * u,
              width: 52 * u,
              height: 12 * u,
              borderRadius: 12 * u,
              backgroundColor: DETAIL,
              transform: 'rotate(-12deg)',
            }}
          />
        )}

        {/* Mouth */}
        <div style={{...mouth, top: (mouth.top as number) - 60 * u}} />

        {/* Facepalm: small coral hand over the face */}
        {emotion === 'facepalm' && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 70 * u,
              transform: `translateX(-50%) rotate(${Math.sin(frame / 15) * 2}deg)`,
              width: 150 * u,
              height: 110 * u,
              borderRadius: 50 * u,
              backgroundColor: BODY_SHADOW,
            }}
          />
        )}

        {/* Small limbs */}
        {[-1, 1].map((side) => {
          const up = emotion === 'celebrating';
          const armWiggle = Math.sin(frame / 6 + side) * (up ? 14 : 4);
          return (
            <div
              key={side}
              style={{
                position: 'absolute',
                left: side === -1 ? -30 * u : undefined,
                right: side === 1 ? -30 * u : undefined,
                top: up ? 60 * u : 190 * u,
                width: 80 * u,
                height: 36 * u,
                borderRadius: 36 * u,
                backgroundColor: BODY,
                transform: `rotate(${side * (up ? -50 : 20) + armWiggle}deg)`,
              }}
            />
          );
        })}
      </div>

      {/* Lightbulb moment */}
      {emotion === 'lightbulb' && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: -140 * u,
            transform: `translateX(-50%) scale(${spring({
              frame: frame - enterAt - 8,
              fps,
              config: SPRINGS.bouncy,
              durationInFrames: 25,
            })})`,
          }}
        >
          <div
            style={{
              width: 110 * u,
              height: 110 * u,
              borderRadius: '50%',
              backgroundColor: COLORS.mustard,
              boxShadow: `${SHADOW_OFFSET.x}px ${SHADOW_OFFSET.y * 0.7}px 0px ${SHADOW_TONES.mustard}`,
            }}
          />
          <div
            style={{
              width: 44 * u,
              height: 30 * u,
              margin: '0 auto',
              borderRadius: `0 0 ${12 * u}px ${12 * u}px`,
              backgroundColor: SHADOW_TONES.mustard,
            }}
          />
        </div>
      )}

      {/* Panic sweat drop */}
      {emotion === 'panicked' && (
        <div
          style={{
            position: 'absolute',
            right: 10 * u,
            top: 80 * u + Math.abs(Math.sin(frame / 8)) * 14,
            width: 30 * u,
            height: 42 * u,
            borderRadius: `50% 50% 50% 50% / 60% 60% 40% 40%`,
            backgroundColor: COLORS.teal,
          }}
        />
      )}
    </div>
  );
};
