"use client";
import { useState } from 'react';
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
  return (
    <div className="layout-top">
      <div className="w-full max-w-sm space-y-4">
        <Card>
          <div className={`money-badge ${moneyClass}`}>💰 <span>{formatMoney(money)}€</span></div>
          <CardHeader>
            <CardTitle>hrryrr</CardTitle>
            <CardDescription>
              Fresh Next.js 15 + React 19 skeleton. Replace this with your app content.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-foreground text-center">
              This is a shadcn-style Card component wired up with Tailwind primitives.
            </p>
          </CardContent>
        </Card>
        <ActionButtons
          onPrimary={() => setMoney((m) => m + 100)}
          onSecondary={() => setMoney((m) => m - 100)}
        />
      </div>
    </div>
  );
}
