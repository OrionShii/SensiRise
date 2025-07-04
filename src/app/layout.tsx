
import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { AlarmProvider } from '@/context/alarm-context';
import { MoodProvider } from '@/context/mood-context';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'SensiRise',
  description: 'An intelligent alarm clock to ensure you are truly awake.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${ptSans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlarmProvider>
            <MoodProvider>
              <AppShell>
                {children}
              </AppShell>
              <Toaster />
            </MoodProvider>
          </AlarmProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
