import type {NorbEmotion} from '../components/Norb';
import type {ConceptKind} from '../components/ConceptCharacter';

/** Component names a scene may request, mapped by the episode engine. */
export type SceneComponentName =
  | 'HookCard'
  | 'SourceCard'
  | 'Norb'
  | 'ConceptCharacter'
  | 'CaptionBand';

export type SceneScript = {
  /** Scene start, in seconds from the beginning of the episode. */
  start: number;
  /** Scene end, in seconds. Scenes must be contiguous and non-overlapping. */
  end: number;
  /** Human-readable description of what appears (for the writer, not rendered). */
  visual: string;
  /** Components to mount in this scene. */
  components: SceneComponentName[];
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
