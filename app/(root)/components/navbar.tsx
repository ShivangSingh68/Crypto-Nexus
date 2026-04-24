'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/market', label: 'Market' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/news', label: 'News' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 card-glass border-b border-[rgba(180,190,254,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#00f5ff] to-[#cba6f7] flex items-center justify-center glow-cyan">
            <span className="text-[#0d0b14] font-orbitron font-black text-sm">N</span>
          </div>
          <span className="font-orbitron font-bold text-sm tracking-widest uppercase text-glow-cyan text-[#00f5ff]">
            Crypto<span className="text-[#cba6f7] text-glow-mauve">Nexus</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl font-rajdhani font-semibold text-sm tracking-wide transition-all duration-200 ${
                  active
                    ? 'bg-[rgba(0,245,255,0.1)] text-[#00f5ff] border border-[rgba(0,245,255,0.3)] text-glow-cyan'
                    : 'text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[rgba(180,190,254,0.06)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[rgba(166,227,161,0.08)] border border-[rgba(166,227,161,0.2)]">
            <span className="text-xs font-mono-tech text-[#a6e3a1]">$</span>
            <span className="font-mono-tech text-sm text-[#a6e3a1] text-gain glow-gain">25,000.00</span>
          </div>
          <Link
            href="/auth/sign-in"
            className="neon-btn-mauve px-4 py-2 rounded-xl font-rajdhani font-semibold text-sm tracking-wide"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-[rgba(180,190,254,0.08)] transition-colors"
        >
          <span className={`block w-5 h-0.5 bg-[#b4befe] transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#b4befe] transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#b4befe] transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[rgba(180,190,254,0.1)] bg-[rgba(13,11,20,0.95)] backdrop-blur-xl px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-rajdhani font-semibold text-sm tracking-wide transition-all ${
                  active
                    ? 'bg-[rgba(0,245,255,0.1)] text-[#00f5ff] border border-[rgba(0,245,255,0.3)]'
                    : 'text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[rgba(180,190,254,0.06)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}