import type { Question } from './types';

export const MAX_STEPS = 10;

export function getQuestion(path: string): Question {
  const level = path.length;
  const amount = (level + 1) * 100;
  return {
    id: path === '' ? 'root' : `node-${path}`,
    text: `Tier ${level + 1}: choose your outcome`,
    options: [
      {
        id: `${path}-opt-pos`,
        text: `Gain ${amount}€`,
        delta: amount,
        nextToken: `${path}0`,
      },
      {
        id: `${path}-opt-neg`,
        text: `Lose ${amount}€`,
        delta: -amount,
        nextToken: `${path}1`,
      },
    ],
  };
}
