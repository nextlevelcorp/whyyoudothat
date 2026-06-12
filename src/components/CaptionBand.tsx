import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, SAFE_AREA, SPRINGS, TYPE, VIDEO, boxShadow} from '../design-system';

type CaptionBandProps = {
  /** Full voiceover line for the scene. */
  text: string;
  /** Words (case-insensitive) to highlight in coral. */
  keywords?: string[];
  /** Duration of the scene in frames; words are spread across ~80% of it. */
  durationInFrames: number;
};

const isKeyword = (word: string, keywords: string[]): boolean => {
  const clean = word.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');
  return keywords.some((k) => clean === k.toLowerCase());
};

/**
 * Word-by-word synced subtitle band, pinned just above the IG bottom
 * safe area. Navy text on a cream card, coral highlight on keywords.
 */
export const CaptionBand: React.FC<CaptionBandProps> = ({
  text,
  keywords = [],
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  // Words appear evenly across the first ~80% of the scene, leaving the
  // tail of the scene fully readable.
  const window = durationInFrames * 0.8;
  const perWord = window / words.length;

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_AREA.left,
        right: SAFE_AREA.right,
        bottom: SAFE_AREA.bottom + 30,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.cream,
          borderRadius: 36,
          boxShadow: boxShadow('cream'),
          padding: '36px 48px',
          maxWidth: VIDEO.width - SAFE_AREA.left - SAFE_AREA.right,
          textAlign: 'center',
          ...TYPE.caption,
          color: COLORS.navy,
        }}
      >
        {words.map((word, i) => {
          const wordStart = i * perWord;
          const pop = spring({
            frame: frame - wordStart,
            fps,
            config: SPRINGS.bouncy,
            durationInFrames: 12,
          });
          const visible = frame >= wordStart;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                opacity: visible ? 1 : 0,
                transform: `scale(${visible ? pop : 0})`,
                color: isKeyword(word, keywords) ? COLORS.coral : COLORS.navy,
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
