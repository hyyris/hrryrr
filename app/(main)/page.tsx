import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
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
      <Button variant="outline">Secondary</Button>
      <Button variant="default">Primary action</Button>
    </div>
  );
}
