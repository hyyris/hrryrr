# Question Graph Authoring

Location: `lib/game/questions.json`

## Structure

```jsonc
{
  "start": "q1", // id of initial question for normal mode
  "questions": {
    "q1": {
      // unique question id
      "id": "q1", // repeat id for clarity
      "text": "Narrative setup.",
      "options": [
        // 2 or 3 options (a,b,c)
        {
          "id": "a",
          "text": "Choice label",
          "consequence": "After selecting, short meme-y outcome.",
          "delta": -20,
          "next": "q2",
        },
        { "id": "b", "text": "...", "consequence": "...", "delta": 50, "next": "q9" },
        { "id": "c", "text": "...", "consequence": "...", "delta": 0, "next": null }, // null = terminal end
      ],
    },
  },
}
```

## Field Rules

- `id`: stable, lowercase. Use pattern `q<number>`. Do not reuse.
- `text`: first-person adjacent, present tense, playful/memey, ≤ 140 chars. Include 1–2 emoji sparingly.
- `options`: 2 or 3 entries. Always sequential ids: `a`, `b`, optional `c`.
  - `text`: imperative / concise action.
  - `consequence`: past-tense or descriptive immediate outcome; keep punchy; avoid trailing spaces; ≤ 160 chars.
  - `delta`: integer (positive gain, negative cost). Typical ranges:
    - Small tweak: -20..20
    - Moderate impact: ±40..150
    - Large swing / climax: ±300 or more (use rarely)
  - `next`: next question id or `null` to end (produces `end|step`).

## Tone Guide

- Lean into light sarcasm + internet meme references ("wallet cries", "diamond hands", "legend", etc.).
- Avoid profanity, slurs, or NSFW content.
- Funny, slightly exaggerated outcomes for mistakes.
- Balance between realistic financial lessons and playful chaos
- Keep one clear joke per line; don’t stack puns.

## Questions & Scenarios

- Narrative style (not just “quiz” questions)
- Options should be meaningful and humorous
- Previous choices should affect later scenarios
- Real events can inspire scenarios (e.g., pandemic, layoffs, financial crises)
- Include responsible vs reckless options: saving, spending, credit, loans, work
- Include loops where appropriate (e.g., back to temptation or work)
- Scenarios can include:
  - Parties and impulse spending
  - Entry level jobs / side hustles
  - Selling old items
  - Simple investments: index funds vs meme coins
  - Credit cards, loans, and debt traps
  - Bills, fines, unexpected expenses

## Balancing Tips

- Early game: mix small negatives with a few neutral/0 and modest positives.
- Mid game escalation: introduce risky larger negatives paired with potential larger positives.
- Endings: terminal nodes should feel like resolution or consequence spike.
- Ensure at least one path can reach a healthy money state and one can crash.

## Adding a New Question

1. Pick next unused id (`q45`, etc.).
2. Insert new block inside `questions` object. Keep trailing commas valid (JSON, not JSON5) — last property has no comma.
3. Reference it from existing option `next` fields to weave into graph.
4. Run `npm run build` to validate JSON shape.

## Editing Existing Nodes

- Maintain option ordering; if removing an option, renumber only if absolutely necessary.
- If changing `next`, verify no orphaned nodes (search for references).
- Keep consistency: similar actions → similar deltas.

## Ending Nodes

- Any option with `next: null` ends the run; choose consequences that summarize mood.
- Large negative endings (e.g. bankruptcy) may pair huge negative delta.

## Common Mistakes

- Trailing comma after last question → build fail.
- Copying a block and forgetting to change internal `id`.
- Setting `next` to an id that doesn’t exist.
- Overusing giant deltas early causing pacing issues.

## Quick Verification

Run:

```
npm run build
```

Check that the build finishes without JSON errors.
