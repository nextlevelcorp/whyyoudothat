import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, CONTENT_BOX, SPRINGS, TYPE, boxShadow} from '../design-system';

type OutroCardProps = {
  /** Headline, e.g. "Follow for more brain stuff". */
  text?: string;
  /** Channel handle shown on the pill. */
  handle?: string;
};

/**
 * End-of-video follow call-to-action. The "subscribe" sibling of
 * SourceCard: use this when the episode ends on a Follow prompt rather
 * than pointing at sources. Coral FOLLOW chip, navy headline card,
 * mustard handle pill.
 */
export const OutroCard: React.FC<OutroCardProps> = ({
  text = 'Follow for more brain stuff',
  handle = '@whyyoudothat',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: SPRINGS.bouncy, durationInFrames: 28});
  const handleIn = spring({frame: frame - 14, fps, config: SPRINGS.bouncy, durationInFrames: 20});
  const pulse = 1 + Math.sin(frame / 12) * 0.015;

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
        gap: 34,
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
          padding: '18px 56px',
          ...TYPE.small,
          fontWeight: 900,
          letterSpacing: 5,
        }}
      >
        FOLLOW
      </div>

      <div
        style={{
          backgroundColor: COLORS.navy,
          borderRadius: 48,
          boxShadow: boxShadow('navy'),
          padding: '60px 56px',
          textAlign: 'center',
          ...TYPE.title,
          fontSize: 62,
          color: COLORS.cream,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {text}
      </div>

      <div
        style={{
          backgroundColor: COLORS.mustard,
          color: COLORS.navy,
          borderRadius: 999,
          boxShadow: boxShadow('mustard'),
          padding: '20px 48px',
          ...TYPE.small,
          fontWeight: 900,
          transform: `scale(${handleIn})`,
        }}
      >
        {handle}
      </div>
    </div>
  );
};
