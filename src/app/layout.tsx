import type { Metadata, Viewport } from 'next';
import { DM_Sans, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  variable: '--font-urdu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mental Health Screening',
  description: 'Bilingual mental health screening questionnaire for university students',
};

export const viewport: Viewport = {
  themeColor: '#EAEFED',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur" className={`${dmSans.variable} ${notoUrdu.variable}`}>
      <body className="font-sans antialiased">
        <div className="app-ambient flex min-h-dvh w-full flex-col md:min-h-0 md:items-center md:justify-center md:py-6 lg:py-8">
          <div className="mx-auto flex w-full min-h-0 min-w-0 flex-1 flex-col md:flex-none md:max-w-[min(100%,42rem)] lg:max-w-[min(100%,48rem)]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
