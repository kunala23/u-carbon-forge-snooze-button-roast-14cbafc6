// Snooze Button Roast — make.fun entry
// Writes one line roasting an alarm clock that rings at 6 AM on a Saturday
// to /output/entry.txt. Deterministic, no network, no secrets, no env vars.
//
// Revision (v2): the entrypoint now scores 3 candidate roasts against the
// judge's 5 published criteria (on-topic, unexpected turn with the punchline
// in the last few words, fresh angle, tightness, sharp specific voice) and
// writes the winner. Scoring:
//   A "My alarm went off at 6 AM on a Saturday, which is the closest thing
//     to a home invasion that still gets to call itself helpful." — 22/25
//     (fresh home-invasion angle, but the punchline softens over its length)
//   B "The alarm rang at 6 AM on a Saturday — apparently even my clock
//     thinks my day off is a rumor." — 19/25
//     (tight, but "day off is a rumor" is vague and the turn is predictable)
//   C "At 6 AM on a Saturday my alarm clock screamed like it was late for
//     a job it doesn't even have." — 24/25
//     (concrete image, the punchline lands on the last five words, and the
//     angle — a clock panicking over a job it never had — is fresh)
import { mkdirSync, writeFileSync } from "node:fs";

// [on-topic, turn, fresh angle, tightness, voice] — each 0-5.
const CANDIDATES: Array<{ text: string; scores: number[] }> = [
  {
    text: "My alarm went off at 6 AM on a Saturday, which is the closest thing to a home invasion that still gets to call itself helpful.",
    scores: [5, 4, 5, 3, 5],
  },
  {
    text: "The alarm rang at 6 AM on a Saturday — apparently even my clock thinks my day off is a rumor.",
    scores: [5, 3, 3, 5, 3],
  },
  {
    text: "At 6 AM on a Saturday my alarm clock screamed like it was late for a job it doesn't even have.",
    scores: [5, 5, 5, 4, 5],
  },
];

let best = CANDIDATES[0];
for (const c of CANDIDATES) {
  const total = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  if (total(c.scores) > total(best.scores)) best = c;
}

const LINE = best.text;
if (LINE.length < 1 || LINE.length > 200 || LINE.trim().length === 0) {
  throw new Error("entry line outside the 1-200 character gate");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");
