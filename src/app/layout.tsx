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
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur" className={`${dmSans.variable} ${notoUrdu.variable}`}>
      <body className="font-sans antialiased">
        <div className="app-ambient min-h-dvh md:flex md:items-center md:justify-center md:py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
