import type { Metadata } from 'next';
import './globals.css';
import Navbar from './(root)/components/navbar';

export const metadata: Metadata = {
  title: 'Crypto Nexus — Virtual Trading Game',
  description: 'Trade fantasy crypto coins, grow your portfolio, and dominate the leaderboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grid-overlay" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, paddingTop: '64px' }}>{children}</main>
      </body>
    </html>
  );
}