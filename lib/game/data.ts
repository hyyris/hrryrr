import type { Question } from './types';

// Three-step binary tree questions keyed by path ("" for root, then '0'/'1').
// This is placeholder content; adjust texts/deltas as needed.
export const MAX_STEPS = 3; // number of questions in a single run

const q = (path: string, text: string, deltas: [number, number]): Question => ({
  id: path === '' ? 'root' : `node-${path}`,
  text,
  options: [
    {
      id: `${path}-opt-0`,
      text: 'Option A',
      delta: deltas[0],
      nextToken: `${path}0`,
    },
    {
      id: `${path}-opt-1`,
      text: 'Option B',
      delta: deltas[1],
      nextToken: `${path}1`,
    },
  ],
});

export const QUESTIONS: Record<string, Question> = {
  '': q('', 'Step 1: Choose your opening move', [+100, -100]),
  '0': q('0', 'Step 2A: Play it safe or push?', [+200, -50]),
  '1': q('1', 'Step 2B: Risk vs reward?', [-50, +200]),
  '00': q('00', 'Step 3AA: Final choice', [+300, -150]),
  '01': q('01', 'Step 3AB: Final choice', [-150, +300]),
  '10': q('10', 'Step 3BA: Final choice', [+250, -100]),
  '11': q('11', 'Step 3BB: Final choice', [-100, +250]),
};
