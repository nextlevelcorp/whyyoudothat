import React from 'react';
import {Composition} from 'remotion';
import {VIDEO} from './design-system';
import {Episode01, episode01Script} from './episodes/episode-01';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="episode-01"
        component={Episode01}
        durationInFrames={episode01Script.durationSec * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
