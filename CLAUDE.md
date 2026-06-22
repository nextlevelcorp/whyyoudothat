# CLAUDE.md

Guidance for working in this repo. **"Why You Do That"** is a Remotion pipeline
that renders vertical Instagram Reels (1080×1920, 30 fps, ~45–60 s) explaining
the neuroscience of everyday behavior, in a frozen **"Cozy Lab"** visual style.

For a deeper architectural reference, read `SYSTEM_SNAPSHOT.md`. This file is the
quick operating manual.

---

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Remotion Studio (live preview/scrubbing) |
| `npm run typecheck` | `tsc --noEmit` — run after every code change |
| `npm run render -- episode-NN` | Render `out/episode-NN.mp4` (H.264) |

### Rendering in this sandbox

Chrome download and Google Fonts TLS are blocked here, so renders need:

```bash
REMOTION_BROWSER_EXECUTABLE=/tmp/chrome-headless-shell-linux64/chrome-headless-shell \
REMOTION_IGNORE_CERT_ERRORS=1 \
npm run render -- episode-NN
```

A single-frame layout check (faster than a full render):

```bash
REMOTION_BROWSER_EXECUTABLE=... REMOTION_IGNORE_CERT_ERRORS=1 \
npx remotion still src/index.ts episode-NN out/preview.png --frame=900
```

On a normal machine, plain `npm run render -- episode-NN` works without the env vars.

---

## Architecture: episodes are data

An episode is a **JSON script** + a **3-line wrapper**. All timeline logic lives
once in `src/episodes/createEpisode.tsx`.

```
src/
├── Root.tsx                  # registers one <Composition> per episode
├── design-system.ts          # FROZEN brand tokens — do not edit
├── components/
│   ├── ActionLayer.tsx       # animated props that ACT OUT the narration (the workhorse)
│   ├── Norb.tsx              # mascot (NorbEmotion enum lives here)
│   ├── ConceptCharacter.tsx  # cute-ified concepts (ConceptKind enum lives here)
│   ├── CaptionBand.tsx       # word-by-word subtitles
│   └── *Card.tsx             # Hook / Science / Takeaway / Source / Outro cards
├── episodes/
│   ├── createEpisode.tsx     # engine: maps a script onto the Remotion timeline
│   └── episode-NN.tsx        # 3-line wrapper per episode
└── scripts/
    ├── schema.ts             # SceneAction / SceneComponentName types
    ├── episode-NN.json       # the script (authored in seconds)
    └── episode-NN.caption.txt# IG caption + verified sources
```

The wrapper is always exactly:

```ts
import {createEpisode} from './createEpisode';
import script from '../scripts/episode-NN.json';
import type {EpisodeScript} from '../scripts/schema';

export const episodeNNScript = script as EpisodeScript;
export const EpisodeNN = createEpisode(episodeNNScript);
```

### Adding an episode (checklist)

1. Add any new `SceneAction` literals to `src/scripts/schema.ts` AND a matching
   `case` in `ActionLayer.tsx`'s switch (add new component variants only —
   never alter existing ones).
2. Write `src/scripts/episode-NN.json`.
3. Add `src/episodes/episode-NN.tsx` (the 3-line wrapper above).
4. Register `<Composition id="episode-NN" .../>` in `src/Root.tsx`.
5. `npm run typecheck` → render → write `episode-NN.caption.txt`.

**Naming triad:** composition `id` === script filename stem === output filename
stem (e.g. `episode-07`).

---

## The "Cozy Lab" rules (non-negotiable)

`design-system.ts` is **FROZEN** — never change tokens (colors, font, springs,
safe areas) without founder approval. When building actions:

- Flat filled rounded shapes, **no outlines**. Depth = one offset shadow only,
  always via `boxShadow(color)`. No blur, no opacity gradients.
- **Spring easing only** (`SPRINGS.bouncy` / `SPRINGS.gentle`). No linear/bezier.
- Colors: cream (bg), coral (primary/mascot), teal (secondary), mustard
  (highlight), navy (text/details).
- Keep critical content inside `CONTENT_BOX`; max 4 elements on screen; one
  scene = one idea.
- Actions scale off `const u = size / 600;` — multiply every dimension by `u`.

## The fixed narrative arc

Every episode: **hook → mechanism (acted out) → why it traps you → the fix →
THE SCIENCE → TRY THIS → sources.** Exactly one `ScienceCard` and one
`TakeawayCard`. Every explanation scene MUST set an `action` (anti-static rule).
The `ScienceCard` beat must name the real mechanism; `TakeawayCard` gives 1–2
imperative do-today steps.

`keywords` are single-word exact matches (no phrases). `cardText` is an optional
crisp headline for card scenes; it falls back to `voiceover`. CaptionBand paces
~6 frames/word, so keep voiceover lines short.

---

## The `/new-episode` workflow

`.claude/commands/new-episode.md` is a two-phase producer prompt:

- **Phase A** — plan & propose (pick number/topic, draft the full script, run a
  gap check for new actions), then STOP for approval.
- **Phase B** — only after approval: branch, add actions, write files, typecheck,
  render, write the caption with **verified** real sources, commit, push, report.

Each episode is built on a branch `episode/NN-slug`, created from the previous
episode's tip to keep linear history.

**Source verification:** WebFetch/WebSearch are blocked in this sandbox, so cited
links cannot be verified here. Always flag this to the user — they must confirm
links before publishing.

**Language:** when chatting with the founder, write comments and questions in
**Turkish** (founder preference). Code, commits, and captions stay in English.

---

## Current episodes (01–11)

| NN | Topic | Mechanism named |
|----|-------|-----------------|
| 01 | scrolling / dopamine | variable reward schedule |
| 02 | free will | readiness potential |
| 03 | stress & status | rank / cortisol |
| 04 | snapping in anger | amygdala hijack / affect labeling |
| 05 | memory editing | reconsolidation |
| 06 | teen recklessness | prefrontal maturation |
| 07 | genes & environment | differential susceptibility |
| 08 | oxytocin | in-group favoritism |
| 09 | habits | basal ganglia chunking |
| 10 | bad news | negativity bias |
| 11 | losing vs gaining | loss aversion / prospect theory |

`ConceptKind` (4): brain, amygdala, dopamine, cortisol. `NorbEmotion` (8):
neutral, panicked, jittery, exhausted, curious, lightbulb, facepalm, celebrating.
`SceneAction` is an ever-growing union in `schema.ts` (one or more new ones per
episode) — read it before reusing.
