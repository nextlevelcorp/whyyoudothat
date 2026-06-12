import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SHADOW_TONES, SHADOW_OFFSET, SPRINGS, BrandColor} from '../design-system';

export type ConceptKind = 'brain' | 'amygdala' | 'dopamine' | 'cortisol';

type ConceptCharacterProps = {
  concept: ConceptKind;
  size?: number;
  /** Frame (relative to the enclosing Sequence) at which it pops in. */
  enterAt?: number;
  style?: React.CSSProperties;
};

const CONCEPT_COLOR: Record<ConceptKind, BrandColor> = {
  brain: 'teal',
  amygdala: 'coral',
  dopamine: 'mustard',
  cortisol: 'teal',
};

/**
 * Generic cute-ified scientific concept: filled rounded shape, dot eyes,
 * tiny smile, pop-in entrance, gentle idle wiggle. Per the style lock,
 * depth comes only from the single darker-tone offset shadow.
 */
export const ConceptCharacter: React.FC<ConceptCharacterProps> = ({
  concept,
  size = 300,
  enterAt = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: SPRINGS.bouncy,
    durationInFrames: 30,
  });
  const wiggle = Math.sin(frame / 14) * 3;

  const color = CONCEPT_COLOR[concept];
  const fill = COLORS[color];
  const shadow = `${SHADOW_OFFSET.x}px ${SHADOW_OFFSET.y}px 0px ${SHADOW_TONES[color]}`;
  const u = size / 300;

  const bodyShape: React.CSSProperties = (() => {
    switch (concept) {
      case 'brain':
        // Lumpy rounded blob.
        return {borderRadius: '48% 52% 55% 45% / 55% 60% 40% 45%'};
      case 'amygdala':
        // Little almond.
        return {borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%', height: size * 0.85};
      case 'dopamine':
        // Round molecule head; satellite atoms added below.
        return {borderRadius: '50%'};
      case 'cortisol':
        // Drop shape.
        return {borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%', height: size * 1.1};
    }
  })();

  const face = (
    <>
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            position: 'absolute',
            left: `calc(50% + ${side * 32 * u}px - ${11 * u}px)`,
            top: '42%',
            width: 22 * u,
            height: 22 * u,
            borderRadius: '50%',
            backgroundColor: COLORS.navy,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '58%',
          transform: 'translateX(-50%)',
          width: 40 * u,
          height: 20 * u,
          borderRadius: `0 0 ${40 * u}px ${40 * u}px`,
          backgroundColor: COLORS.navy,
        }}
      />
    </>
  );

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size * 1.2,
        transform: `rotate(${wiggle}deg) scale(${enter})`,
        transformOrigin: '50% 80%',
        ...style,
      }}
    >
      {/* Dopamine satellite atoms */}
      {concept === 'dopamine' &&
        [{x: -0.18, y: 0.62, s: 0.3}, {x: 0.85, y: 0.7, s: 0.26}].map((a, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: a.x * size,
              top: a.y * size,
              width: a.s * size,
              height: a.s * size,
              borderRadius: '50%',
              backgroundColor: COLORS.coral,
              boxShadow: `${SHADOW_OFFSET.x}px ${SHADOW_OFFSET.y * 0.6}px 0px ${SHADOW_TONES.coral}`,
              transform: `translateY(${Math.sin(frame / 10 + i * 2) * 6}px)`,
            }}
          />
        ))}

      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          backgroundColor: fill,
          boxShadow: shadow,
          ...bodyShape,
        }}
      >
        {face}
      </div>
    </div>
  );
};
