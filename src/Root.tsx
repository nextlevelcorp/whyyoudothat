import React from 'react';
import {Composition} from 'remotion';
import {VIDEO} from './design-system';
import {Episode01, episode01Script} from './episodes/episode-01';
import {Episode02, episode02Script} from './episodes/episode-02';
import {Episode03, episode03Script} from './episodes/episode-03';
import {Episode04, episode04Script} from './episodes/episode-04';
import {Episode05, episode05Script} from './episodes/episode-05';
import {Episode06, episode06Script} from './episodes/episode-06';
import {Episode07, episode07Script} from './episodes/episode-07';

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
      <Composition
        id="episode-04"
        component={Episode04}
        durationInFrames={episode04Script.durationSec * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="episode-05"
        component={Episode05}
        durationInFrames={episode05Script.durationSec * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="episode-06"
        component={Episode06}
        durationInFrames={episode06Script.durationSec * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="episode-07"
        component={Episode07}
        durationInFrames={episode07Script.durationSec * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
