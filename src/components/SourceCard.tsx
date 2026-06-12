import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, CONTENT_BOX, SPRINGS, TYPE, boxShadow} from '../design-system';

type SourceCardProps = {
  text?: string;
};

/**
 * End-of-video card pointing viewers to the sources in the caption.
 */
export const SourceCard: React.FC<SourceCardProps> = ({
  text = 'Sources in caption 👇',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: SPRINGS.bouncy, durationInFrames: 30});
  const bob = Math.sin(frame / 10) * 8;

  return (
    <div
      style={{
        position: 'absolute',
        left: CONTENT_BOX.x,
        top: CONTENT_BOX.y + CONTENT_BOX.height / 2 - 120,
        width: CONTENT_BOX.width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40,
        transform: `scale(${enter})`,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.teal,
          borderRadius: 48,
          boxShadow: boxShadow('teal'),
          padding: '60px 70px',
          textAlign: 'center',
          ...TYPE.title,
          color: COLORS.cream,
        }}
      >
        {text}
      </div>
      <div
        style={{
          ...TYPE.small,
          color: COLORS.navy,
          transform: `translateY(${bob}px)`,
          fontSize: 64,
        }}
      >
        👇
      </div>
    </div>
  );
};
