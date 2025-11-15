"use client";
import { useEffect, useState, useRef } from 'react';
import ActionButtons from '@/components/action-buttons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  const [money, setMoney] = useState(0);
  const moneyClass = money > 0 ? 'money-positive' : money < 0 ? 'money-negative' : 'money-neutral';
  const formatMoney = (v: number) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<null | {
    id: string;
    text: string;
    options: { id: string; text: string; delta: number; nextToken: string }[];
    isLast: boolean;
  }>(null);
  const [selections, setSelections] = useState<Array<{ questionId: string; optionId: string; delta: number }>>([]);
  const moodAnimRef = useRef<number | null>(null);
  const moodJitterRef = useRef<number | null>(null);
  const lastTargetsRef = useRef<{center:number[];mid:number[];edge:number[]}|null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/questions?path=${encodeURIComponent(token)}`);
        if (!res.ok) throw new Error(`Failed to load question (${res.status})`);
        const data = await res.json();
        if (data.done) {
          setQuestion(null);
        } else {
          const { question, isLast } = data;
          if (!ignore) setQuestion({ ...question, isLast });
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message ?? 'Error loading question');
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [token]);
  useEffect(() => {
    const root = document.documentElement;
    const to = (h:number,s:number,l:number)=>[h,s,l];
    const targets = money > 0
      ? { center: to(140,70,50), mid: to(152,80,60), edge: to(165,90,10), x:62, y:65 }
      : money < 0
        ? { center: to(0,78,55), mid: to(8,82,62), edge: to(345,60,12), x:38, y:35 }
        : { center: to(200,92,80), mid: to(210,94,86), edge: to(220,96,96), x:50, y:55 };

    if (moodJitterRef.current) { clearInterval(moodJitterRef.current); moodJitterRef.current = null; }
    if (moodAnimRef.current) { clearInterval(moodAnimRef.current); moodAnimRef.current = null; }

    const start = lastTargetsRef.current || targets; // first run jumps immediately
    const steps = 24;
    let i = 0;
    moodAnimRef.current = window.setInterval(() => {
      i++;
      const t = Math.min(i/steps,1);
      const ease = t*t*(3-2*t); // smoothstep
      const lerp = (a:number,b:number)=>a+(b-a)*ease;
      const mix = (src:number[], dst:number[]) => [lerp(src[0],dst[0]), lerp(src[1],dst[1]), lerp(src[2],dst[2])];
      const c = mix(start.center, targets.center);
      const m = mix(start.mid, targets.mid);
      const e = mix(start.edge, targets.edge);
      root.style.setProperty('--mood-center', `hsl(${c[0]} ${c[1]}% ${c[2]}%)`);
      root.style.setProperty('--mood-mid', `hsl(${m[0]} ${m[1]}% ${m[2]}%)`);
      root.style.setProperty('--mood-edge', `hsl(${e[0]} ${e[1]}% ${e[2]}%)`);
      const baseX = targets.x;
      const baseY = targets.y;
      root.style.setProperty('--mood-x', `${baseX}%`);
      root.style.setProperty('--mood-y', `${baseY}%`);
      if (t === 1) {
        clearInterval(moodAnimRef.current!);
        lastTargetsRef.current = { center: targets.center, mid: targets.mid, edge: targets.edge };
      }
    }, 1000/steps);
    return () => {
      if (moodAnimRef.current) clearInterval(moodAnimRef.current);
      if (moodJitterRef.current) clearInterval(moodJitterRef.current);
    };
  }, [money]);
  return (
    <div className="layout-top">
      <div className="mood-overlay" aria-hidden />
      <div className="stack-fixed space-y-4">
        <Card>
          <div className={`money-badge ${moneyClass}`}>💰 <span>{formatMoney(money)}€</span></div>
          <CardHeader>
            <CardTitle>{question ? 'Question' : 'hrryrr'}</CardTitle>
            <CardDescription>
              {question ? question.text : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {loading && <p className="text-muted-foreground">Loading…</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {!loading && !error && !question && (
              <p className="text-foreground text-center">All done! Final score: {formatMoney(money)}€</p>
            )}
          </CardContent>
        </Card>
        <ActionButtons
          primaryLabel={question?.options?.[0]?.text}
          secondaryLabel={question?.options?.[1]?.text}
          disabled={!question || !!error || loading}
          primaryDelta={question?.options?.[0]?.delta}
          secondaryDelta={question?.options?.[1]?.delta}
          onPrimary={() => {
            if (!question) return;
            const opt = question.options[0];
            setMoney((m) => m + opt.delta);
            setSelections((arr) => [...arr, { questionId: question.id, optionId: opt.id, delta: opt.delta }]);
            setToken(opt.nextToken);
          }}
          onSecondary={() => {
            if (!question) return;
            const opt = question.options[1];
            setMoney((m) => m + opt.delta);
            setSelections((arr) => [...arr, { questionId: question.id, optionId: opt.id, delta: opt.delta }]);
            setToken(opt.nextToken);
          }}
        />
      </div>
    </div>
  );
}
