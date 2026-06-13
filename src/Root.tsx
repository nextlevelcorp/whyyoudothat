import React from 'react';
import {Composition} from 'remotion';
import {VIDEO} from './design-system';
import {Episode01, episode01Script} from './episodes/episode-01';
import {Episode02, episode02Script} from './episodes/episode-02';
import {Episode03, episode03Script} from './episodes/episode-03';

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
      <Composition
        id="episode-02"
        component={Episode02}
        durationInFrames={episode02Script.durationSec * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="episode-03"
        component={Episode03}
        durationInFrames={episode03Script.durationSec * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
