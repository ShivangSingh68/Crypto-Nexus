import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import Navbar from './(root)/components/navbar';

export const metadata: Metadata = {
  title: 'Crypto Nexus — Virtual Trading Game',
  description: 'Trade fantasy crypto coins, grow your portfolio, and dominate the leaderboard.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const session = await auth();
  return (
    <SessionProvider session={session}>
    <html lang="en">
      <body className="min-h-screen grid-overlay">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
    </SessionProvider>
  );
}