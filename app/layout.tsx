import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'AI Brand Builder - Generate your brand with AI',
  description: 'Generate business names, slogans and logo concepts with AI',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
