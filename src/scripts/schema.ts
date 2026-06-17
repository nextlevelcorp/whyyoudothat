import type {NorbEmotion} from '../components/Norb';
import type {ConceptKind} from '../components/ConceptCharacter';

/** Component names a scene may request, mapped by the episode engine. */
export type SceneComponentName =
  | 'HookCard'
  | 'SourceCard'
  | 'OutroCard'
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
  | 'barrier' // navy friction wall + lock blocking a phone
  | 'slotMachine' // spinning reels + lever: variable reward schedule
  | 'wave' // urge wave rises and dies; the friction step outlasts it
  | 'dragAway' // app icon gets dragged off the phone and tossed out
  | 'chart' // animated bar chart: dopamine vs reward probability (peak at "maybe")
  | 'freeChoice' // LEFT/RIGHT buttons + cursor pressing one + ticking clock
  | 'readiness' // -7s -> 0s timeline: brain signal fires before you feel the choice
  | 'backstage' // a "you" figure with a slipping CEO crown; brain works levers behind a curtain
  | 'coinFlip' // a coin half-flips and settles at ~60% accuracy
  | 'hierarchy' // rank ladder: bottom-rank creature trembles, top-rank wears a crown
  | 'rankChart' // bar chart: cortisol rises as social rank falls (low-rank bar tallest)
  | 'connect'  // two creatures slide together; a warm pulse calms the stressed one
  | 'alarm'    // red rings pulse outward from the amygdala; threat spark zaps in
  | 'hijack'   // two tracks from brain: fast coral "low road" beats slow teal "high road" to the body
  | 'labelTame' // ANGRY label drops onto the alarm; red rings shrink, calm teal ring blooms
  | 'recall'    // navy file drawer; a memory card rises, glows editable (mustard halo), then re-files
  | 'drift'     // three memory cards left-to-right: each copy is more tilted/teal-shifted than the last
  | 'reconsolidate' // memory card with a padlock: lock springs open → card glows LABILE → lock snaps shut
  | 'gasBrakes'    // GAS pedal floored (coral) next to a half-built BRAKE pedal under scaffolding (teal)
  | 'construction' // teal brain whose front is wrapped in scaffolding + crane: the judgment part still wiring
  | 'maturation'   // 0→25 age axis sweeps; the prefrontal brain only fills in at the mid-twenties mark
  | 'geneSwitch'      // DNA strand with toggle switches; sun/cloud environment cycles them on (teal) or off (navy)
  | 'orchidDandelion' // split-screen: teal orchid reacts dramatically, mustard dandelion barely changes
  | 'susceptibility'  // crossover line chart: steep teal "SENSITIVE" vs flat mustard "RESILIENT" across environments
  | 'inGroup'         // teal dots cluster inside a navy ring; a coral outsider dot is pushed further away
  | 'widenCircle'     // navy ring springs outward, coral outsider enters and turns teal, mustard pulse blooms
  | 'groupTrust';     // two-bar chart: tall teal "YOUR GROUP" vs short navy "OUTSIDERS" — in-group favoritism

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
  /**
   * Optional crisp headline for card components (ScienceCard / TakeawayCard
   * / OutroCard). Lets the card state a short claim while CaptionBand shows
   * the full spoken line. Falls back to `voiceover` when omitted.
   */
  cardText?: string;
  /** Words highlighted in coral in captions and hook text. */
  keywords?: string[];
};

export type EpisodeScript = {
  title: string;
  durationSec: number;
  scenes: SceneScript[];
};
