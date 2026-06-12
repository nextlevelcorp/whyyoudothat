import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, CONTENT_BOX, SPRINGS, TYPE, boxShadow} from '../design-system';

type TakeawayCardProps = {
  /** One concrete, doable tip — short imperative lines work best. */
  text: string;
  /** Words rendered in coral. */
  keywords?: string[];
  /** Small label on the chip above the card. */
  label?: string;
};

/**
 * The "so what do I DO?" card. Every episode must end with exactly one of
 * these before the SourceCard: a single concrete action the viewer can take
 * today, in big type. Lines are split on newlines in `text`.
 */
export const TakeawayCard: React.FC<TakeawayCardProps> = ({
  text,
  keywords = [],
  label = 'TRY THIS',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: SPRINGS.bouncy, durationInFrames: 28});
  const pulse = 1 + Math.sin(frame / 12) * 0.012;
  const lines = text.split('\n').filter(Boolean);

  return (
    <div
      style={{
        position: 'absolute',
        left: CONTENT_BOX.x,
        top: CONTENT_BOX.y + 60,
        width: CONTENT_BOX.width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 36,
        transform: `scale(${enter * pulse})`,
        transformOrigin: '50% 30%',
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.coral,
          color: COLORS.cream,
          borderRadius: 999,
          boxShadow: boxShadow('coral'),
          padding: '18px 48px',
          ...TYPE.small,
          fontWeight: 900,
          letterSpacing: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          backgroundColor: COLORS.mustard,
          borderRadius: 48,
          boxShadow: boxShadow('mustard'),
          padding: '60px 56px',
          textAlign: 'center',
          ...TYPE.title,
          fontSize: 60,
          color: COLORS.navy,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {lines.map((line, li) => {
          const lineIn = spring({
            frame: frame - 8 - li * 10,
            fps,
            config: SPRINGS.bouncy,
            durationInFrames: 18,
          });
          return (
            <div key={li} style={{transform: `scale(${lineIn})`}}>
              {line.split(/\s+/).map((word, wi, arr) => {
                const clean = word.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');
                const hot = keywords.some((k) => clean === k.toLowerCase());
                return (
                  <React.Fragment key={wi}>
                    <span style={{color: hot ? COLORS.coral : COLORS.navy}}>
                      {word}
                    </span>
                    {wi < arr.length - 1 ? ' ' : ''}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
