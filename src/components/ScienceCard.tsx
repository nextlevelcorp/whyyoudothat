import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, CONTENT_BOX, SPRINGS, TYPE, boxShadow} from '../design-system';

type ScienceCardProps = {
  /**
   * The scientific backing, newline-separated into 1–2 short lines:
   * line 1 names the mechanism, line 2 says why the fix works.
   */
  text: string;
  /** Words rendered in mustard. */
  keywords?: string[];
  /** Small label on the chip above the card. */
  label?: string;
};

/**
 * The "here's the actual science" card — what separates us from generic
 * advice channels. Every episode has exactly one, right before the
 * TakeawayCard: name the mechanism, then explain in one line why the
 * upcoming tip exploits it. Navy card, cream text, mustard keywords.
 */
export const ScienceCard: React.FC<ScienceCardProps> = ({
  text,
  keywords = [],
  label = 'THE SCIENCE',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: SPRINGS.bouncy, durationInFrames: 28});
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
        transform: `scale(${enter})`,
        transformOrigin: '50% 30%',
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.teal,
          color: COLORS.cream,
          borderRadius: 999,
          boxShadow: boxShadow('teal'),
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
          backgroundColor: COLORS.navy,
          borderRadius: 48,
          boxShadow: boxShadow('navy'),
          padding: '60px 56px',
          textAlign: 'center',
          ...TYPE.title,
          fontSize: 58,
          color: COLORS.cream,
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {lines.map((line, li) => {
          const lineIn = spring({
            frame: frame - 8 - li * 14,
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
                    <span style={{color: hot ? COLORS.mustard : COLORS.cream}}>
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
