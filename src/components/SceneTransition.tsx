import React from 'react';
import {spring, useCurrentFrame, useVideoConfig, AbsoluteFill} from 'remotion';
import {COLORS, SPRINGS, VIDEO} from '../design-system';

type SceneTransitionProps = {
  /** Frame (relative to the enclosing Sequence) at which the wipe peaks. */
  at: number;
};

/** Total length of the transition overlay in frames. */
export const TRANSITION_FRAMES = 20;

/**
 * The one and only scene transition: a coral circle pops out from the
 * center, briefly covers the screen, then shrinks away. Place it so that
 * `at` lands on the cut between two scenes.
 */
export const SceneTransition: React.FC<SceneTransitionProps> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const grow = spring({
    frame: frame - (at - TRANSITION_FRAMES / 2),
    fps,
    config: SPRINGS.bouncy,
    durationInFrames: TRANSITION_FRAMES / 2,
  });
  const shrink = spring({
    frame: frame - at,
    fps,
    config: SPRINGS.gentle,
    durationInFrames: TRANSITION_FRAMES / 2,
  });
  const scale = grow - shrink;
  if (scale <= 0.001) return null;

  // Circle large enough to cover the full 1080x1920 frame at scale 1.
  const diameter = Math.hypot(VIDEO.width, VIDEO.height) * 1.05;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: diameter,
          height: diameter,
          borderRadius: '50%',
          backgroundColor: COLORS.coral,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
