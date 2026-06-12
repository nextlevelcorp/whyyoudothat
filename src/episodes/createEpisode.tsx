import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {COLORS, CONTENT_BOX, VIDEO} from '../design-system';
import {Norb} from '../components/Norb';
import {ConceptCharacter} from '../components/ConceptCharacter';
import {CaptionBand} from '../components/CaptionBand';
import {HookCard} from '../components/HookCard';
import {SourceCard} from '../components/SourceCard';
import {SceneTransition} from '../components/SceneTransition';
import type {EpisodeScript, SceneScript} from '../scripts/schema';

const toFrames = (sec: number) => Math.round(sec * VIDEO.fps);

/**
 * Renders one scene's component list. Layout follows the style lock:
 * one scene = one idea, max 4 elements on screen.
 */
const Scene: React.FC<{scene: SceneScript; durationInFrames: number}> = ({
  scene,
  durationInFrames,
}) => {
  const has = (name: string) => scene.components.includes(name as never);
  const hasConcept = has('ConceptCharacter') && scene.concept;

  return (
    <AbsoluteFill>
      {has('HookCard') && (
        <HookCard text={scene.voiceover} keywords={scene.keywords} />
      )}

      {has('SourceCard') && <SourceCard />}

      {hasConcept && (
        <div
          style={{
            position: 'absolute',
            left: CONTENT_BOX.x + 40,
            top: CONTENT_BOX.y + 140,
          }}
        >
          <ConceptCharacter concept={scene.concept!} size={340} enterAt={4} />
        </div>
      )}

      {has('Norb') && (
        <div
          style={{
            position: 'absolute',
            // With a concept on screen, Norb stands to the right and lower;
            // alone (hook/sources), he sits bottom-center inside the safe area.
            right: hasConcept ? CONTENT_BOX.x + 20 : undefined,
            left: hasConcept ? undefined : '50%',
            top: hasConcept ? CONTENT_BOX.y + 420 : undefined,
            bottom: hasConcept ? undefined : 380,
            transform: hasConcept ? undefined : 'translateX(-50%)',
          }}
        >
          <Norb emotion={scene.norbEmotion ?? 'neutral'} size={hasConcept ? 320 : 380} />
        </div>
      )}

      {has('CaptionBand') && (
        <CaptionBand
          text={scene.voiceover}
          keywords={scene.keywords}
          durationInFrames={durationInFrames}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Episode engine: maps a script JSON onto the timeline. Each episode file
 * stays thin — it just imports its JSON and calls this.
 */
export const createEpisode = (script: EpisodeScript): React.FC => {
  const Episode: React.FC = () => (
    <AbsoluteFill style={{backgroundColor: COLORS.cream}}>
      {script.scenes.map((scene, i) => {
        const from = toFrames(scene.start);
        const duration = toFrames(scene.end) - from;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={duration}
            name={`Scene ${i + 1}: ${scene.visual}`}
          >
            <Scene scene={scene} durationInFrames={duration} />
          </Sequence>
        );
      })}

      {/* One standard transition over every interior scene cut. */}
      {script.scenes.slice(1).map((scene, i) => (
        <Sequence
          key={`t-${i}`}
          from={toFrames(scene.start) - 15}
          durationInFrames={30}
          name={`Transition ${i + 1}`}
        >
          <SceneTransition at={15} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
  return Episode;
};
