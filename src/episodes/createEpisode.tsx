import React from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, CONTENT_BOX, SPRINGS, VIDEO} from '../design-system';
import {Norb} from '../components/Norb';
import {ConceptCharacter} from '../components/ConceptCharacter';
import {CaptionBand} from '../components/CaptionBand';
import {HookCard} from '../components/HookCard';
import {SourceCard} from '../components/SourceCard';
import {TakeawayCard} from '../components/TakeawayCard';
import {ActionLayer} from '../components/ActionLayer';
import {SceneTransition} from '../components/SceneTransition';
import type {EpisodeScript, SceneScript} from '../scripts/schema';

const toFrames = (sec: number) => Math.round(sec * VIDEO.fps);

/** Slides a child in from off-screen with a bouncy spring. */
const SlideIn: React.FC<{
  from: 'left' | 'right';
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({from, delay = 0, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = spring({frame: frame - delay, fps, config: SPRINGS.bouncy, durationInFrames: 28});
  const x = (1 - t) * (from === 'left' ? -420 : 420);
  return <div style={{...style, transform: `translateX(${x}px)`}}>{children}</div>;
};

/**
 * Renders one scene. Anti-static rules baked in:
 * - the whole stage drifts on a slow zoom, so nothing ever fully stops;
 * - the scene's `action` acts out the narration center-stage;
 * - characters slide in from the edges instead of appearing in place.
 * Style lock still applies: one idea, max 4 elements on screen.
 */
const Scene: React.FC<{scene: SceneScript; durationInFrames: number}> = ({
  scene,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const has = (name: string) => scene.components.includes(name as never);
  const hasConcept = Boolean(has('ConceptCharacter') && scene.concept);
  const hasAction = Boolean(scene.action);

  // Slow push-in over the scene: from 100% to ~105%.
  const zoom = 1 + 0.05 * (frame / Math.max(durationInFrames, 1));

  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 42%'}}>
      {has('HookCard') && (
        <HookCard text={scene.voiceover} keywords={scene.keywords} />
      )}

      {has('TakeawayCard') && (
        <TakeawayCard text={scene.voiceover} keywords={scene.keywords} />
      )}

      {has('SourceCard') && <SourceCard />}

      {/* The action performs the narration, center stage. */}
      {hasAction && (
        <div
          style={{
            position: 'absolute',
            left: CONTENT_BOX.x,
            top: CONTENT_BOX.y + 60,
            width: CONTENT_BOX.width,
          }}
        >
          <ActionLayer action={scene.action!} size={620} />
        </div>
      )}

      {/* Concept character watches from the top-left, sliding in. */}
      {hasConcept && (
        <SlideIn
          from="left"
          delay={2}
          style={{
            position: 'absolute',
            left: CONTENT_BOX.x,
            top: hasAction ? CONTENT_BOX.y - 40 : CONTENT_BOX.y + 140,
          }}
        >
          <ConceptCharacter
            concept={scene.concept!}
            size={hasAction ? 230 : 340}
            enterAt={2}
          />
        </SlideIn>
      )}

      {/* Norb reacts from the bottom-right (or bottom-center when alone). */}
      {has('Norb') &&
        (hasAction || hasConcept ? (
          <SlideIn
            from="right"
            delay={4}
            style={{
              position: 'absolute',
              right: CONTENT_BOX.x - 10,
              top: CONTENT_BOX.y + 680,
            }}
          >
            <Norb emotion={scene.norbEmotion ?? 'neutral'} size={270} />
          </SlideIn>
        ) : (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 380,
              transform: 'translateX(-50%)',
            }}
          >
            <Norb emotion={scene.norbEmotion ?? 'neutral'} size={380} />
          </div>
        ))}

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
