import { NextRequest } from 'next/server';
import { MAX_STEPS, QUESTIONS } from '@/lib/game/data';
import type { DoneResponse, QuestionResponse } from '@/lib/game/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = (searchParams.get('path') || '').replace(/[^01]/g, '');
  const step = path.length;

  if (step >= MAX_STEPS) {
    const done: DoneResponse = { done: true, step, token: path };
    return Response.json(done);
  }

  const question = QUESTIONS[path];
  if (!question) {
    return new Response('Question not found', { status: 404 });
  }

  const isLast = step === MAX_STEPS - 1;
  const payload: QuestionResponse = {
    token: path,
    step,
    isLast,
    question,
  };
  return Response.json(payload);
}
