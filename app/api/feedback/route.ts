import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.selections)) {
    return new Response('Invalid payload', { status: 400 });
  }
  // selections: Array<{ questionId: string; optionId: string; delta: number }>
  const total = body.selections.reduce(
    (acc: number, s: { delta: number }) => acc + (typeof s.delta === 'number' ? s.delta : 0),
    0,
  );
  return Response.json({
    ok: true,
    total,
    message: total >= 0 ? 'Nice! You navigated to a positive outcome.' : 'Tough break. Try a different path next time.',
  });
}
