import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Web3Modal } from '@/context/Web3Modal';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pocket Monsters',
  description: "Gotta Catch 'Em All",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <Web3Modal>
          {children}
          <Toaster position="bottom-right" reverseOrder={false} />
        </Web3Modal>
      </body>
    </html>
  );
}
