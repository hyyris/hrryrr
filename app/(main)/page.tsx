"use client";
import { useEffect, useState, useRef } from 'react';
import ActionButtons from '@/components/action-buttons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  const [money, setMoney] = useState(100);
  const moneyClass = money > 0 ? 'money-positive' : money < 0 ? 'money-negative' : 'money-neutral';
  const formatMoney = (v: number) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restart, setRestart] = useState(0);
  const [question, setQuestion] = useState<null | {
    id: string;
    text: string;
    options: { id: string; text: string; delta: number; nextToken: string; consequence?: string }[];
    isLast: boolean;
  }>(null);
  const [lastConsequence, setLastConsequence] = useState<string | null>(null);
  const [selections, setSelections] = useState<Array<{ questionId: string; optionId: string; delta: number }>>([]);
  const moodAnimRef = useRef<number | null>(null);
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
  }, [token, restart]);
  useEffect(() => {
    const root = document.documentElement;
    const to = (h:number,s:number,l:number)=>[h,s,l];
    const targets = money > 100
      ? { center: to(140,70,50), mid: to(152,80,60), edge: to(165,90,10), x:62, y:65 }
      : money < 0
        ? { center: to(0,78,55), mid: to(8,82,62), edge: to(345,60,12), x:38, y:35 }
        : { center: to(200,92,80), mid: to(210,94,86), edge: to(220,96,96), x:50, y:55 };

    if (moodAnimRef.current) { 
      cancelAnimationFrame(moodAnimRef.current); moodAnimRef.current = null;
    }

    const start = lastTargetsRef.current || targets; // first run jumps immediately
    const duration = 600; // ms
    const startTime = performance.now();
    const ease = (t:number) => t*t*(3-2*t); // smoothstep
    const lerp = (a:number,b:number,t:number)=>a+(b-a)*t;
    // Avoid hue cross-over (yellow/orange) by snapping hue to target and only tweening S and L
    const mixKeepHue = (src:number[], dst:number[], t:number) => [dst[0], lerp(src[1],dst[1],t), lerp(src[2],dst[2],t)];

    const step = () => {
      const now = performance.now();
      const raw = Math.min((now - startTime) / duration, 1);
      const t = ease(raw);
      const c = mixKeepHue(start.center, targets.center, t);
      const m = mixKeepHue(start.mid, targets.mid, t);
      const e = mixKeepHue(start.edge, targets.edge, t);
      root.style.setProperty('--mood-center', `hsl(${c[0]} ${c[1]}% ${c[2]}%)`);
      root.style.setProperty('--mood-mid', `hsl(${m[0]} ${m[1]}% ${m[2]}%)`);
      root.style.setProperty('--mood-edge', `hsl(${e[0]} ${e[1]}% ${e[2]}%)`);
      root.style.setProperty('--mood-x', `${targets.x}%`);
      root.style.setProperty('--mood-y', `${targets.y}%`);
      if (raw < 1) {
        moodAnimRef.current = requestAnimationFrame(step);
      } else {
        lastTargetsRef.current = { center: targets.center, mid: targets.mid, edge: targets.edge };
        moodAnimRef.current = null;
      }
    };
    moodAnimRef.current = requestAnimationFrame(step);
    return () => {
      if (moodAnimRef.current) cancelAnimationFrame(moodAnimRef.current);
    };
  }, [money]);
  return (
    <div className="layout-top">
      <div className="mood-overlay" aria-hidden />
      <div className="stack-fixed space-y-4">
        <header className="app-header">
          <h1 className="app-title">Spendocalypse</h1>
        </header>
        <Card>
          <div className={`money-badge ${moneyClass}`}>💰 <span>{formatMoney(money)}€</span></div>
          <CardHeader>
            <CardTitle>{question ? '' : 'Run complete'}</CardTitle>
            {question && lastConsequence && (
              <p className="consequence-text text-sm text-muted-foreground font-medium">{lastConsequence}</p>
            )}
            <CardDescription>
              {question ? question.text : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {loading && <p className="text-muted-foreground">Loading…</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {!loading && !error && !question && (
              <div className="flex flex-col items-center gap-3">
                <p className="text-foreground text-center text-base">
                  {(() => {
                    if (money >= 1000) return 'Legendary run. You broke the simulation.';
                    if (money >= 500) return 'You thrived. Spreadsheet gods salute you.';
                    if (money >= 200) return 'Solid finish. Calm gains, clear mind.';
                    if (money >= 50) return 'You survived and saved. Respectable.';
                    if (money >= 0) return 'Barely afloat, but afloat. Learnings secured.';
                    if (money >= -100) return 'Ouch. Recoverable chaos.';
                    return 'Total financial whiplash. May your next run be wiser.';
                  })()}
                </p>
                <p className="text-muted-foreground text-sm">Final score: <span className={moneyClass}>{formatMoney(money)}€</span></p>
                <Button onClick={() => {
                  setMoney(100);
                  setSelections([]);
                  setLastConsequence(null);
                  setError(null);
                  setQuestion(null);
                  setToken('');
                  setRestart((n) => n + 1);
                }}>
                  <span className="inline-flex items-center gap-1"><span>Try again</span><span aria-hidden>↺</span></span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <ActionButtons
          primaryLabel={question?.options?.[0]?.text}
          secondaryLabel={question?.options?.[1]?.text}
          tertiaryLabel={question?.options?.[2]?.text}
          disabled={!question || !!error || loading}
          primaryDelta={question?.options?.[0]?.delta}
          secondaryDelta={question?.options?.[1]?.delta}
          tertiaryDelta={question?.options?.[2]?.delta}
          onPrimary={() => {
            if (!question) return;
            const opt = question.options[0];
            setMoney((m) => m + opt.delta);
            setSelections((arr) => [...arr, { questionId: question.id, optionId: opt.id, delta: opt.delta }]);
            setLastConsequence(opt.consequence || null);
            setToken(opt.nextToken);
          }}
          onSecondary={() => {
            if (!question) return;
            const opt = question.options[1];
            setMoney((m) => m + opt.delta);
            setSelections((arr) => [...arr, { questionId: question.id, optionId: opt.id, delta: opt.delta }]);
            setLastConsequence(opt.consequence || null);
            setToken(opt.nextToken);
          }}
          onTertiary={() => {
            if (!question || !question.options[2]) return;
            const opt = question.options[2];
            setMoney((m) => m + opt.delta);
            setSelections((arr) => [...arr, { questionId: question.id, optionId: opt.id, delta: opt.delta }]);
            setLastConsequence(opt.consequence || null);
            setToken(opt.nextToken);
          }}
        />
      </div>
    </div>
  );
}
