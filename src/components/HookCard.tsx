import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, CONTENT_BOX, SPRINGS, TYPE, boxShadow} from '../design-system';

type HookCardProps = {
  /** Big hook line shown in the opening 0–3s. */
  text: string;
  /** Words (case-insensitive) rendered in coral. */
  keywords?: string[];
};

/**
 * Opening hook screen: one big navy statement on a cream card,
 * keywords popped in coral, bouncy entrance.
 */
export const HookCard: React.FC<HookCardProps> = ({text, keywords = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: SPRINGS.bouncy, durationInFrames: 30});
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <div
      style={{
        position: 'absolute',
        left: CONTENT_BOX.x,
        top: CONTENT_BOX.y + 80,
        width: CONTENT_BOX.width,
        display: 'flex',
        justifyContent: 'center',
        transform: `scale(${enter})`,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.cream,
          borderRadius: 48,
          boxShadow: boxShadow('cream'),
          padding: '70px 60px',
          textAlign: 'center',
          ...TYPE.hook,
          color: COLORS.navy,
        }}
      >
        {words.map((word, i) => {
          const clean = word.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');
          const hot = keywords.some((k) => clean === k.toLowerCase());
          const pop = spring({
            frame: frame - 6 - i * 3,
            fps,
            config: SPRINGS.bouncy,
            durationInFrames: 15,
          });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                color: hot ? COLORS.coral : COLORS.navy,
                transform: `scale(${pop})`,
              }}
            >
              {word + (i < words.length - 1 ? ' ' : '')}
            </span>
          );
        })}
      </div>
    </div>
  );
};
