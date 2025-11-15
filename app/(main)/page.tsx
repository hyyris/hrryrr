"use client";
import { useEffect, useState } from 'react';
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
  return (
    <div className="layout-top">
      <div className="stack-fixed space-y-4">
        <Card>
          <div className={`money-badge ${moneyClass}`}>💰 <span>{formatMoney(money)}€</span></div>
          <CardHeader>
            <CardTitle>{question ? 'Question' : 'hrryrr'}</CardTitle>
            <CardDescription>
              {question ? question.text : 'Fresh Next.js 15 + React 19 skeleton. Replace this with your app content.'}
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
