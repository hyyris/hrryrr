import type { Question } from './types';
import raw from './questions.json';

type RawOption = { id: string; text: string; delta: number; next: string | null };
type RawGraph = {
  start: string;
  questions: Record<string, {
    id: string;
    text: string;
    options: RawOption[]; // length 2 or 3
  }>;
};

const GRAPH: RawGraph = raw as unknown as RawGraph;

function parseToken(token: string): { qid: string | null; step: number } {
  if (!token) return { qid: GRAPH.start, step: 0 };
  if (token.toLowerCase().startsWith('end')) return { qid: null, step: Number(token.split('|')[1] || '0') };
  const [qid, stepStr] = token.split('|');
  const step = Number.isFinite(Number(stepStr)) ? Number(stepStr) : 0;
  return { qid: qid || GRAPH.start, step };
}

export function getQuestion(token: string): Question | null {
  const { qid, step } = parseToken(token);
  if (!qid) return null;
  const src = GRAPH.questions[qid];
  if (!src) return null;
  const mapped = src.options.slice(0,3).map(o => ({
    id: o.id,
    text: o.text,
    delta: o.delta,
    nextToken: o.next ? `${o.next}|${step + 1}` : `end|${step + 1}`,
  }));
  return { id: src.id, text: src.text, options: mapped };
}

export function getMeta(token: string): { step: number; isLast: boolean; normalizedToken: string; done: boolean } {
  const { qid, step } = parseToken(token);
  if (!qid) return { step, isLast: true, normalizedToken: `end|${step}`, done: true };
  const src = GRAPH.questions[qid];
  if (!src) return { step, isLast: true, normalizedToken: `end|${step}`, done: true };
  const isLast = src.options.every(o => !o.next);
  return { step, isLast, normalizedToken: `${qid}|${step}`, done: false };
}

// For compatibility: there is no fixed MAX_STEPS in branching mode.
export const MAX_STEPS = Number.POSITIVE_INFINITY;
