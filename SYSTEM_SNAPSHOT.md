# SYSTEM_SNAPSHOT.md

Handoff documentation for **"Why You Do That"** — a Remotion pipeline that
produces vertical Instagram Reels (1080×1920, 30 fps, ~45–60 s) in the
frozen **"Cozy Lab"** visual style.

This snapshot describes the project as of the finalized template
(episode-01 with the dopamine-vs-probability science chart). A collaborator
should be able to understand and extend the system from this file alone,
without reading the source.

> Scope note: this documents one episode (`episode-01`) plus the shared
> template it runs on. Each new episode is added by writing a JSON script and
> a 3-line wrapper (see §5 and §6).

---

## 1. Folder tree

```
src/
├── index.ts                     # Remotion entry: registerRoot(RemotionRoot)
├── Root.tsx                     # registers <Composition> per episode
├── design-system.ts             # FROZEN brand tokens (single source of truth)
├── components/
│   ├── Norb.tsx                 # mascot (Norbert the Neuron)
│   ├── ConceptCharacter.tsx     # cute-ified scientific concept
│   ├── ActionLayer.tsx          # animated props that ACT OUT the narration
│   ├── CaptionBand.tsx          # word-by-word subtitle band
│   ├── HookCard.tsx             # opening big-text hook
│   ├── ScienceCard.tsx          # "THE SCIENCE" explainer card
│   ├── TakeawayCard.tsx         # "TRY THIS" concrete-tip card
│   ├── SourceCard.tsx           # "Sources in caption" end card
│   └── SceneTransition.tsx      # the one standard transition
├── episodes/
│   ├── createEpisode.tsx        # engine: maps a script JSON onto the timeline
│   └── episode-01.tsx           # thin per-episode wrapper (3 lines)
└── scripts/
    ├── schema.ts                # TypeScript types for the script schema
    └── episode-01.json          # episode-01 script data
```

Relevant repo-root files (outside `src/`):

```
package.json            # npm scripts + deps
remotion.config.ts      # render config (image format, overwrite, sandbox env hooks)
scripts/render.mjs      # custom render wrapper used by `npm run render`
tsconfig.json           # strict TS, jsx: react-jsx, resolveJsonModule
out/                    # render output (gitignored), out/<episode-id>.mp4
```

---

## 2. `design-system.ts` — every exported token

This file is **FROZEN** ("Cozy Lab" style lock). Do not modify without
founder approval. Flat vector illustration, no outlines, depth via a single
darker-tone offset shadow only, one scene = one idea, max 4 elements on screen.

### `COLORS` (exact hex)

| Token   | Hex       | Role                |
|---------|-----------|---------------------|
| `cream` | `#FFF6EA` | background          |
| `coral` | `#FF6B5B` | primary / mascot    |
| `teal`  | `#2EC4B6` | secondary           |
| `mustard`| `#FFB627`| highlight           |
| `navy`  | `#1B2A4A` | text & details      |

`export type BrandColor = keyof typeof COLORS;` → `'cream' | 'coral' | 'teal' | 'mustard' | 'navy'`.

### `SHADOW_TONES` (darker companion per color — the ONLY depth mechanism)

| For color | Shadow hex |
|-----------|-----------|
| `cream`   | `#F0E2CE` |
| `coral`   | `#D94F41` |
| `teal`    | `#21A296` |
| `mustard` | `#E09B12` |
| `navy`    | `#111C33` |

### `SHADOW_OFFSET`
`{ x: 0, y: 14 }` — every shape casts exactly one offset copy in its darker
tone, shifted by this amount. No blur, no opacity.

### `boxShadow(color: BrandColor): string`
Helper returning `"0px 14px 0px <SHADOW_TONES[color]>"`. Use this everywhere
instead of hand-writing shadows.

### Typography
- Font: **Nunito**, loaded via `@remotion/google-fonts/Nunito`
  (`loadFont('normal', { weights: ['700','800','900'], subsets: ['latin'] })`).
- `FONT_FAMILY` = the loaded Nunito family string.
- `TYPE` presets (all use `FONT_FAMILY`):

| Preset    | fontWeight | fontSize | lineHeight |
|-----------|-----------|----------|------------|
| `hook`    | 900       | 110      | 1.1        |
| `title`   | 800       | 72       | 1.15       |
| `caption` | 800       | 56       | 1.25       |
| `small`   | 700       | 40       | 1.3        |

### `SPRINGS` (spring-based easing only — no linear/bezier)
- `bouncy`: `{ damping: 10, stiffness: 120 }` — pop-in entrances, squash-and-stretch, celebrations.
- `gentle`: `{ damping: 14, stiffness: 80 }` — idle wiggle, drifts, subtle moves.

### `VIDEO`
`{ width: 1080, height: 1920, fps: 30 }`.

### `SAFE_AREA` (reserved for Instagram UI; no critical content inside)
`{ top: 220, bottom: 320, left: 60, right: 60 }` (pixels).

### `CONTENT_BOX` (usable area inside the safe area)
Derived: `{ x: 60, y: 220, width: 960, height: 1380 }`
(`width = 1080 − 60 − 60`, `height = 1920 − 220 − 320`).

---

## 3. Components (`src/components/`)

Props are listed name : type (default). All components are stateless React
function components driven by Remotion's `useCurrentFrame()`.

### `Norb.tsx` — `<Norb>`
- `emotion?: NorbEmotion` (`'neutral'`)
- `size?: number` (`360`) — body diameter in px
- `enterAt?: number` (`0`) — frame (relative to the enclosing Sequence) of pop-in
- `style?: React.CSSProperties`

Renders **Norbert the Neuron**: round coral neuron with dendrite "hair", dot
eyes, tiny limbs; always-on idle wiggle with expression/motion layered by
`emotion`. Norbert never speaks, only reacts.

### `ConceptCharacter.tsx` — `<ConceptCharacter>`
- `concept: ConceptKind` (required)
- `size?: number` (`300`)
- `enterAt?: number` (`0`)
- `style?: React.CSSProperties`

Renders a cute-ified scientific concept (filled rounded shape, dot eyes, tiny
smile, bouncy pop-in, idle wiggle). Shape & color vary by `concept`
(`brain`→teal blob, `amygdala`→coral almond, `dopamine`→mustard molecule with
satellite atoms, `cortisol`→teal drop).

### `ActionLayer.tsx` — `<ActionLayer>`
- `action: SceneAction` (required)
- `size?: number` (`600`) — width/height of the square stage

Dispatches on `action` to one self-contained animated mini-scene that **acts
out the narration**. This is the anti-static workhorse. Implemented actions:
`scroll` (endless feed phone), `burst` (reward sparkles), `loop` (dots chasing
on a ring), `barrier` (friction wall + lock blocking a lunging phone),
`slotMachine` (spinning reels + lever), `wave` (urge wave swells/dies while a
friction step outlasts it), `dragAway` (app icon dragged off a phone),
`chart` (bar chart of dopamine vs reward probability, peaking at 50% "maybe").

### `CaptionBand.tsx` — `<CaptionBand>`
- `text: string` (required) — full voiceover line
- `keywords?: string[]` (`[]`)
- `durationInFrames: number` (required)

Renders a subtitle band pinned just above the bottom safe area: navy text on a
cream card, words pop in one-by-one, keywords highlighted in coral. Pacing is
snappy: `perWord = min(6, durationInFrames * 0.45 / wordCount)` frames — the
full line is always readable within the first ~45% of the scene.

### `HookCard.tsx` — `<HookCard>`
- `text: string` (required)
- `keywords?: string[]` (`[]`)

Renders the opening 0–3 s hook: one big navy statement on a cream card,
keyword words in coral, bouncy entrance.

### `ScienceCard.tsx` — `<ScienceCard>`
- `text: string` (required) — newline-split into 1–2 short lines
- `keywords?: string[]` (`[]`) — highlighted in **mustard**
- `label?: string` (`'THE SCIENCE'`) — chip above the card

Renders the "THE SCIENCE" beat: teal chip + navy card with cream text. Line 1
names the mechanism; line 2 says why the tip works.

### `TakeawayCard.tsx` — `<TakeawayCard>`
- `text: string` (required) — newline-split into 1–2 imperative lines
- `keywords?: string[]` (`[]`) — highlighted in **coral**
- `label?: string` (`'TRY THIS'`) — chip above the card

Renders the "TRY THIS" beat: coral chip + mustard card with navy text — the
episode's one concrete, doable-today action.

### `SourceCard.tsx` — `<SourceCard>`
- `text?: string` (`'Sources in caption 👇'`)

Renders the end card: teal card with cream text plus a gently bobbing 👇.

### `SceneTransition.tsx` — `<SceneTransition>`
- `at: number` (required) — frame (relative to the enclosing Sequence) at which the wipe peaks

Renders the one and only transition: a coral circle pops out from center,
briefly covers the full frame, then shrinks away. Also exports
`TRANSITION_FRAMES = 20`.

---

## 4. Script schema (exact types)

From `src/scripts/schema.ts` (verbatim), plus the two enums it imports.

```ts
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
  | 'scroll'      // phone with an endlessly scrolling feed
  | 'burst'       // repeating reward sparkle bursts
  | 'loop'        // orbiting dots: stuck-in-a-loop motion
  | 'barrier'     // navy friction wall + lock blocking a phone
  | 'slotMachine' // spinning reels + lever: variable reward schedule
  | 'wave'        // urge wave rises and dies; the friction step outlasts it
  | 'dragAway'    // app icon gets dragged off the phone and tossed out
  | 'chart';      // animated bar chart: dopamine vs reward probability (peak at "maybe")

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
```

### Allowed values

- **`norbEmotion`** (`NorbEmotion`, 8 values):
  `neutral` | `panicked` | `jittery` | `exhausted` | `curious` | `lightbulb` | `facepalm` | `celebrating`
- **`concept`** (`ConceptKind`, 4 values):
  `brain` | `amygdala` | `dopamine` | `cortisol`
- **`components`** (`SceneComponentName`, 7 values):
  `HookCard` | `SourceCard` | `ScienceCard` | `TakeawayCard` | `Norb` | `ConceptCharacter` | `CaptionBand`
- **`action`** (`SceneAction`, 8 values):
  `scroll` | `burst` | `loop` | `barrier` | `slotMachine` | `wave` | `dragAway` | `chart`

### Field notes / required-vs-optional
- Required on every scene: `start`, `end`, `visual`, `components`, `voiceover`.
- Optional: `action`, `norbEmotion`, `concept`, `keywords`.
- `concept` is only honored when `components` includes `ConceptCharacter`
  (the engine renders the concept only if `scene.concept` is set).
- `action` is only honored when set; required by convention for explanation
  scenes (see §7).
- Scenes are addressed in **seconds** (`start`/`end`); the engine converts to
  frames at 30 fps and they should be contiguous and non-overlapping.
- `keywords` matching is per-word, cleaned, case-insensitive, **exact word**
  match — multi-word phrases will not highlight; list single words.

---

## 5. `episode-01` script + how it maps onto the timeline

### `src/scripts/episode-01.json` (verbatim)

```json
{
  "title": "Why your brain begs for one more scroll",
  "durationSec": 55,
  "scenes": [
    {
      "start": 0, "end": 3,
      "visual": "Big hook text, curious Norb peeking from below",
      "components": ["HookCard", "Norb"],
      "norbEmotion": "curious",
      "voiceover": "Why can't you stop scrolling?",
      "keywords": ["scrolling"]
    },
    {
      "start": 3, "end": 12,
      "visual": "Phone with endlessly scrolling feed cards; Norb watches hooked",
      "components": ["Norb", "CaptionBand"],
      "action": "scroll",
      "norbEmotion": "curious",
      "voiceover": "Every swipe is a tiny lottery. Most posts are boring, but the next one might be amazing.",
      "keywords": ["lottery", "amazing"]
    },
    {
      "start": 12, "end": 21,
      "visual": "Reward sparkles burst around the dopamine character; Norb gets jittery",
      "components": ["ConceptCharacter", "Norb", "CaptionBand"],
      "action": "burst",
      "norbEmotion": "jittery",
      "concept": "dopamine",
      "voiceover": "That maybe fires dopamine. Your brain rewards the chance, not the post.",
      "keywords": ["maybe", "dopamine", "chance"]
    },
    {
      "start": 21, "end": 28,
      "visual": "Three dots chase each other around a circle, never arriving; Norb exhausted",
      "components": ["Norb", "CaptionBand"],
      "action": "loop",
      "norbEmotion": "exhausted",
      "voiceover": "So you chase the next maybe, and the next. A loop with no finish line.",
      "keywords": ["loop"]
    },
    {
      "start": 28, "end": 35,
      "visual": "Navy friction wall with a lock pops up and blocks the lunging phone; Norb gets the idea",
      "components": ["Norb", "CaptionBand"],
      "action": "barrier",
      "norbEmotion": "lightbulb",
      "voiceover": "The way out is not willpower. It is friction: make scrolling cost an extra step.",
      "keywords": ["friction", "step"]
    },
    {
      "start": 35, "end": 44,
      "visual": "THE SCIENCE card; below it a bar chart of dopamine vs reward chance pops up, peaking and sparkling at 50% 'maybe'; Norb curious",
      "components": ["ScienceCard", "Norb"],
      "action": "chart",
      "norbEmotion": "curious",
      "voiceover": "Dopamine peaks when a reward is a maybe, not a sure thing.\nThe slot machine trick: a variable reward schedule.",
      "keywords": ["dopamine", "maybe", "variable", "reward", "schedule"]
    },
    {
      "start": 44, "end": 51,
      "visual": "TRY THIS card; below it the coral app icon gets dragged off the phone and tossed away; Norb celebrates",
      "components": ["TakeawayCard", "Norb"],
      "action": "dragAway",
      "norbEmotion": "celebrating",
      "voiceover": "Log out after every use.\nMove the app off your home screen.",
      "keywords": ["log", "out", "move"]
    },
    {
      "start": 51, "end": 55,
      "visual": "Sources card, Norb celebrating below",
      "components": ["SourceCard", "Norb"],
      "norbEmotion": "celebrating",
      "voiceover": "Sources in caption.",
      "keywords": []
    }
  ]
}
```

(Arc: hook → mechanism → why it traps you → the fix → THE SCIENCE → TRY THIS → sources.)

### How `episode-01.tsx` maps it

`src/episodes/episode-01.tsx` is a 3-line wrapper:

```ts
import {createEpisode} from './createEpisode';
import script from '../scripts/episode-01.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode01Script = script as EpisodeScript;
export const Episode01 = createEpisode(episode01Script);
```

`createEpisode(script)` (`src/episodes/createEpisode.tsx`) returns a React
component that:

1. Fills the frame with a cream background.
2. For each scene, mounts a Remotion `<Sequence>` from
   `round(start*30)` for `round(end*30) − round(start*30)` frames, rendering
   a `<Scene>`.
3. `<Scene>` applies a **slow push-in zoom** (`scale 1 → ~1.05` across the
   scene) and renders, by `components`:
   - cards (`HookCard` / `ScienceCard` / `TakeawayCard` / `SourceCard`),
   - the `action` via `<ActionLayer>` — centered on its own, or rendered
     **compact below the card** on ScienceCard/TakeawayCard scenes,
   - `ConceptCharacter` sliding in from the left,
   - `Norb` sliding in from the bottom-right (or centered bottom when it is
     the only character), reacting with `norbEmotion`,
   - `CaptionBand` pinned above the bottom safe area.
4. Inserts the **standard `<SceneTransition>`** (coral circle pop) over every
   interior scene cut — a 30-frame sequence starting 15 frames before each
   scene boundary.

The composition is registered in `src/Root.tsx`:

```tsx
<Composition
  id="episode-01"
  component={Episode01}
  durationInFrames={episode01Script.durationSec * VIDEO.fps}  // 55 * 30 = 1650
  fps={30}
  width={1080}
  height={1920}
/>
```

---

## 6. Build / render commands & output naming

`package.json` scripts:

| Command | Runs | Purpose |
|---------|------|---------|
| `npm run dev` | `remotion studio` | Live preview / scrubbing in Remotion Studio |
| `npm run render -- <episode-id>` | `node scripts/render.mjs <episode-id>` | Render an episode to MP4 |
| `npm run typecheck` | `tsc --noEmit` | Type-check the project |

**Render details** (`scripts/render.mjs`): runs
`npx remotion render src/index.ts <episode-id> out/<episode-id>.mp4 --codec h264`,
creating `out/` if needed.

- **Output path / naming:** `out/<episode-id>.mp4` — the `<episode-id>` you
  pass is the composition `id`, the script filename stem, and the output
  filename stem (all identical). Example: `npm run render -- episode-01` →
  `out/episode-01.mp4`.
- `remotion.config.ts` sets `setVideoImageFormat('jpeg')` and
  `setOverwriteOutput(true)`.
- Rendered video spec: H.264, 1080×1920, 30 fps, ~55 s for episode-01.

### Adding a new episode
1. Write `src/scripts/episode-XX.json` (follow §4 schema and the §7 arc).
2. Add `src/episodes/episode-XX.tsx` (copy the 3-line wrapper).
3. Register a `<Composition id="episode-XX" …>` in `src/Root.tsx`.
4. `npm run render -- episode-XX` → `out/episode-XX.mp4`.

---

## 7. Conventions established during refinement (differ from a stock Remotion setup)

These are project rules, not Remotion defaults — honor them when extending.

1. **Frozen design system.** `design-system.ts` is the single source of
   truth and the "Cozy Lab" style lock. Do not change tokens (colors, font,
   springs, safe areas) without founder approval.

2. **Single offset shadow for depth only.** Always use `boxShadow(color)`.
   No blur, no opacity gradients, no outlines — flat filled rounded shapes.

3. **Spring easing only.** Use `SPRINGS.bouncy` / `SPRINGS.gentle`. No
   linear or bezier easing anywhere.

4. **JSON-driven episodes.** Episodes are data, not code: a JSON script plus
   a 3-line wrapper. All timeline logic lives once in `createEpisode`. Scenes
   are authored in **seconds**, converted to frames at 30 fps by the engine.

5. **The visual must act out the voiceover (anti-static rule).** Every
   explanation scene (everything between the hook and the takeaway) sets an
   `action`; `ActionLayer` is the library of these animations and is what the
   founder review demanded. The engine additionally applies an automatic slow
   push-in zoom and slide-in character entrances so no scene is ever static.
   On card scenes the action is rendered compactly **below** the card so the
   card states the idea and the animation demonstrates it.

6. **Fixed narrative arc.** Every episode follows:
   **hook → mechanism (acted out) → why it traps you → the fix → THE SCIENCE → TRY THIS → sources.**
   Exactly one `ScienceCard` and exactly one `TakeawayCard` per episode.

7. **"Name the science" differentiator.** The `ScienceCard` beat must name
   the actual mechanism (e.g. "variable reward schedule"), and its `action`
   must visualize that claim — quantitative claims get the `chart` action.
   The card text and the animation describe the same fact.

8. **One concrete takeaway.** The `TakeawayCard` ("TRY THIS") gives 1–2
   imperative, doable-today steps (newline-separated in `voiceover`), placed
   right before the `SourceCard`.

9. **Snappy caption pacing.** `CaptionBand` paces words at ~6 frames each and
   always finishes the line within the first ~45% of the scene — a custom rule,
   not a Remotion default. Keep voiceover lines short.

10. **One transition style only.** The coral-circle-pop `SceneTransition` is
    auto-inserted at every interior scene cut by the engine. Do not introduce
    other transitions.

11. **Instagram safe areas reserved.** Keep all critical content inside
    `CONTENT_BOX` (top 220 px / bottom 320 px reserved for IG UI). Max 4
    elements on screen; one scene = one idea.

12. **Keyword highlighting is single-word exact match.** List individual
    words in `keywords`; multi-word phrases will not highlight.

13. **Custom render wrapper.** Rendering goes through `scripts/render.mjs`
    (not `remotion render` directly), which fixes the output to
    `out/<episode-id>.mp4` with `--codec h264`.

14. **Naming triad.** Composition `id` === script filename stem === output
    filename stem (e.g. `episode-01`).

15. **Sandbox render hooks (optional, env-gated).** `remotion.config.ts`
    honors `REMOTION_BROWSER_EXECUTABLE` (path to a local
    Chrome/chrome-headless-shell, for environments that block Remotion's
    Chrome download) and `REMOTION_IGNORE_CERT_ERRORS=1` (for TLS-intercepting
    egress proxies that break Google Fonts). Neither is needed on a normal
    local machine; plain `npm run render -- episode-01` works there.
