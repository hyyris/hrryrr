import type { Metadata } from 'next';
import './globals.css';
import { Rubik } from 'next/font/google';

const rubik = Rubik({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'hrryrr',
  description: 'Skeleton Next.js app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${rubik.className} min-h-screen bg-background text-foreground antialiased`}
        style={{ fontFamily: '"Momo Trust Display", Rubik, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}
      >
        <main className="min-h-screen flex items-center justify-center p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
