import { NextRequest } from 'next/server';
import { getQuestion, getMeta } from '@/lib/game/data';
import type { DoneResponse, QuestionResponse } from '@/lib/game/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path') || '';
  const meta = getMeta(path);
  const question = getQuestion(path);
  if (!question) {
    const done: DoneResponse = { done: true, step: meta.step, token: meta.normalizedToken };
    return Response.json(done);
  }
  const isLast = meta.isLast;
  const payload: QuestionResponse = {
    token: meta.normalizedToken,
    step: meta.step,
    isLast,
    question,
  };
  return Response.json(payload);
}
