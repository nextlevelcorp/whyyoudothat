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
    CaptionBand.tsx       # word-by-word synced subtitles
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
      "components": ["HookCard"],       // HookCard | SourceCard | Norb | ConceptCharacter | CaptionBand
      "norbEmotion": "curious",         // neutral | panicked | jittery | exhausted | curious | lightbulb | facepalm | celebrating
      "concept": "dopamine",            // brain | amygdala | dopamine | cortisol (with ConceptCharacter)
      "voiceover": "exact narration text",
      "keywords": ["words to highlight in coral"]
    }
  ]
}
```
