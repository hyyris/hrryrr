import ActionButtons from '@/components/action-buttons';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  const money = 0;
  const moneyClass = money > 0 ? 'money-positive' : money < 0 ? 'money-negative' : 'money-neutral';
  return (
    <div className="layout-top">
      <div className="w-full max-w-sm space-y-4">
        <Card>
          <div className={`money-badge ${moneyClass}`}>💰 <span>{money}€</span></div>
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
        <ActionButtons />
      </div>
    </div>
  );
}
