import type {NorbEmotion} from '../components/Norb';
import type {ConceptKind} from '../components/ConceptCharacter';

/** Component names a scene may request, mapped by the episode engine. */
export type SceneComponentName =
  | 'HookCard'
  | 'SourceCard'
  | 'ScienceCard'
  | 'TakeawayCard'
  | 'Norb'
  | 'ConceptCharacter'
  | 'CaptionBand';

/**
 * Animated action that ACTS OUT the voiceover. Every explanation scene
 * must have one — the visual must show what the narration says, never
 * just characters standing around.
 */
export type SceneAction =
  | 'scroll' // phone with an endlessly scrolling feed
  | 'burst' // repeating reward sparkle bursts
  | 'loop' // orbiting dots: stuck-in-a-loop motion
  | 'barrier'; // navy friction wall + lock blocking a phone

export type SceneScript = {
  /** Scene start, in seconds from the beginning of the episode. */
  start: number;
  /** Scene end, in seconds. Scenes must be contiguous and non-overlapping. */
  end: number;
  /** Human-readable description of what appears (for the writer, not rendered). */
  visual: string;
  /** Components to mount in this scene. */
  components: SceneComponentName[];
  /**
   * Animated prop that performs the narration on screen.
   * Required for every explanation scene (anything between the hook
   * and the takeaway) so the video never goes static.
   */
  action?: SceneAction;
  /** Norb's reaction during the scene (only used if 'Norb' is mounted). */
  norbEmotion?: NorbEmotion;
  /** Concept character to show (only used if 'ConceptCharacter' is mounted). */
  concept?: ConceptKind;
  /** Exact narration text; also drives the CaptionBand. */
  voiceover: string;
  /** Words highlighted in coral in captions and hook text. */
  keywords?: string[];
};

export type EpisodeScript = {
  title: string;
  durationSec: number;
  scenes: SceneScript[];
};
