# Why You Do That 🧠

Remotion pipeline for producing Instagram Reels (1080×1920, 30fps, 45–60s)
for the science channel **Why You Do That**.

## Style: "Cozy Lab" (FROZEN 🔒)

Do not modify without founder approval.

- Flat vector illustration, warm cream background `#FFF6EA`
- Filled rounded geometric shapes, **no outlines**
- Depth via a **single darker-tone offset shadow** only
- Palette: coral `#FF6B5B` (primary/mascot), teal `#2EC4B6` (secondary),
  mustard `#FFB627` (highlight), deep navy `#1B2A4A` (text & details)
- Concepts personified as cute characters: dot eyes, small limbs,
  minimal expressive faces
- Mascot: **Norbert the Neuron** — round coral neuron, dendrite "hair",
  never speaks, only reacts
- Animation: bouncy squash-and-stretch, pop-in entrances, gentle idle
  wiggle, spring-based easing only
- Typography: Nunito, navy on cream, coral keyword highlights
- Vertical 1080×1920, one scene = one idea, max 4 elements on screen
- IG safe areas reserved: top 220px, bottom 320px

All tokens live in [`src/design-system.ts`](src/design-system.ts) — the
single source of truth.

## Project layout

```
src/
  design-system.ts        # frozen brand tokens (colors, font, springs, safe areas)
  components/
    Norb.tsx              # mascot, `emotion` prop + idle wiggle
    ConceptCharacter.tsx  # cute-ified concepts (brain, amygdala, dopamine, cortisol)
    ActionLayer.tsx       # animated props that act out the narration (scroll/burst/loop/barrier)
    ScienceCard.tsx       # "THE SCIENCE" card: names the mechanism + why the tip works
    TakeawayCard.tsx      # "TRY THIS" card: the episode's one concrete tip
    CaptionBand.tsx       # word-by-word synced subtitles (snappy pacing)
    HookCard.tsx          # 0–3s big-text hook
    SourceCard.tsx        # "Sources in caption 👇" end card
    SceneTransition.tsx   # the one standard transition (coral circle pop)
  episodes/
    createEpisode.tsx     # engine: maps a script JSON onto the timeline
    episode-01.tsx        # thin per-episode file (imports its JSON)
  scripts/
    schema.ts             # TypeScript types for the script schema
    episode-01.json       # episode script (scenes, voiceover, keywords)
```

## Workflow

```bash
npm install
npm run dev                  # Remotion Studio for previewing
npm run render -- episode-01 # renders out/episode-01.mp4
```

## Episode rules (apply to EVERY episode)

These came out of the episode-01 review and are part of the template:

1. **The visual must act out the voiceover — card scenes included.**
   Every scene except the hook and sources must set an `action` that
   performs what the narration says — never characters just standing
   around. On `ScienceCard`/`TakeawayCard` scenes the engine renders the
   action compactly below the card, so the card states the idea and the
   animation demonstrates it. Available actions: `scroll`, `burst`,
   `loop`, `barrier`, `slotMachine`, `wave`, `dragAway` (extend
   `ActionLayer.tsx` when a topic needs a new one, then add it to the
   schema). The engine also adds a slow push-in zoom and slide-in
   entrances to every scene, so nothing is ever static.
2. **Captions are snappy.** `CaptionBand` paces words at ~6 frames each
   and always finishes the line within the first 45% of the scene. Keep
   voiceover lines short (max ~15 words per scene) so they stay readable.
3. **Name the science, briefly but explicitly.** Generic advice is what
   everyone posts; our differentiator is the backing. Every episode has
   exactly one `ScienceCard` scene ("THE SCIENCE") right before the
   takeaway: line 1 names the actual mechanism (e.g. "variable reward
   schedule"), line 2 says in plain words why the upcoming tip defeats
   it. Two short lines max — crisp, not a lecture.
4. **One concrete takeaway, always.** Every episode ends with a
   `TakeawayCard` scene right before the `SourceCard`: a "TRY THIS" card
   with 1–2 imperative, doable-today steps (newline-separated in
   `voiceover`). The narrative arc is fixed:
   **hook → mechanism (acted out) → why it traps you → the fix → THE SCIENCE → TRY THIS → sources.**

### Adding an episode

1. Write `src/scripts/episode-XX.json` following the schema in
   `src/scripts/schema.ts`.
2. Create `src/episodes/episode-XX.tsx` (3 lines — copy episode-01).
3. Register the composition in `src/Root.tsx`.
4. Work on a branch named `episode/XX-topic` (e.g. `episode/01-dopamine`).
5. `npm run render -- episode-XX` → MP4 lands in `out/`.

### Script schema

```jsonc
{
  "title": "",
  "durationSec": 55,
  "scenes": [
    {
      "start": 0, "end": 3,            // seconds
      "visual": "what appears (notes for the writer)",
      "components": ["HookCard"],       // HookCard | SourceCard | ScienceCard | TakeawayCard | Norb | ConceptCharacter | CaptionBand
      "action": "scroll",               // scroll | burst | loop | barrier | slotMachine | wave | dragAway — acts out the narration (required everywhere except hook/sources)
      "norbEmotion": "curious",         // neutral | panicked | jittery | exhausted | curious | lightbulb | facepalm | celebrating
      "concept": "dopamine",            // brain | amygdala | dopamine | cortisol (with ConceptCharacter)
      "voiceover": "exact narration text",
      "keywords": ["words to highlight in coral"]
    }
  ]
}
```
