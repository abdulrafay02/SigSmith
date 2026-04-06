import type {Metadata} from 'next';
import { Inter, Orbitron, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-tech' });

export const metadata: Metadata = {
  title: 'SigSmith | Forge Your Professional Identity',
  description: 'Minimal, professional email signature generator with a forging theme.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.variable} ${orbitron.variable} ${spaceGrotesk.variable} font-sans bg-zinc-950 text-zinc-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
