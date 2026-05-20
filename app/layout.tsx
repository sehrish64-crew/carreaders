import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://carreaders.ai'),
  title: 'Car Readers - Vehicle Condition Insights',
  description:
    'Car Readers turns vehicle photos into fast condition reports with intelligent damage detection, health scoring, and repair guidance.',
  openGraph: {
    title: 'Car Readers - Vehicle Condition Insights',
    description:
      'Smart vehicle condition analysis from image input to actionable report with clear recommendations.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-foreground antialiased font-sans" suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}