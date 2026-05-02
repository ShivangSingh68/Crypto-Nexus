'use client';

import { useState } from 'react';
import { Chrome, Github, Lock, Shield, Zap } from 'lucide-react';
import { handleOAuth } from '../action';

export default function SignInPage() {
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | null>(null);

  const handleOAuthBtn = async (provider: 'google' | 'github') => {
    setLoadingProvider(provider);
    await handleOAuth(provider);
    setLoadingProvider(null);
  };

  const isLoading = loadingProvider !== null;

  return (
    <div className="card-glass-strong rounded-3xl p-10">

      {/* ── Logo ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-5">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#00f5ff] to-[#cba6f7] flex items-center justify-center glow-cyan">
            <span className="text-[#0d0b14] font-orbitron font-black text-sm">N</span>
          </div>
          <span className="font-orbitron font-bold text-base tracking-widest uppercase text-[#00f5ff] text-glow-cyan">
            Crypto<span className="text-[#cba6f7]">Nexus</span>
          </span>
        </div>
        <h1 className="font-orbitron font-bold text-2xl uppercase tracking-wider text-[#cdd6f4] mb-2">
          Welcome Back
        </h1>
        <p className="font-rajdhani text-base text-[#585b70]">
          Sign in to your trading account
        </p>
      </div>

      {/* ── Label ── */}
      <p className="font-rajdhani text-xs uppercase tracking-widest text-[#45475a] text-center mb-4">
        Choose your login method
      </p>

      {/* ── Google ── */}
      <button
        onClick={() => handleOAuthBtn('google')}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 h-14 px-5 rounded-xl mb-3 font-rajdhani font-semibold text-base tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-[rgba(180,190,254,0.12)] bg-[rgba(66,133,244,0.07)] text-[#cdd6f4] hover:bg-[rgba(66,133,244,0.15)] hover:border-[rgba(66,133,244,0.4)] hover:shadow-[0_0_18px_rgba(66,133,244,0.2)] hover:-translate-y-0.5"
      >
        {loadingProvider === 'google' ? (
          <span className="w-5 h-5 border-2 border-t-transparent border-[#4285F4] rounded-full animate-spin" />
        ) : (
          <Chrome size={20} className="text-[#4285F4] shrink-0" />
        )}
        <span>
          {loadingProvider === 'google' ? 'Connecting to Google...' : 'Continue with Google'}
        </span>
      </button>

      {/* ── GitHub ── */}
      <button
        onClick={() => handleOAuthBtn('github')}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 h-14 px-5 rounded-xl font-rajdhani font-semibold text-base tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-[rgba(180,190,254,0.12)] bg-[rgba(180,190,254,0.05)] text-[#cdd6f4] hover:bg-[rgba(180,190,254,0.12)] hover:border-[rgba(180,190,254,0.35)] hover:shadow-[0_0_18px_rgba(180,190,254,0.15)] hover:-translate-y-0.5"
      >
        {loadingProvider === 'github' ? (
          <span className="w-5 h-5 border-2 border-t-transparent border-[#b4befe] rounded-full animate-spin" />
        ) : (
          <Github size={20} className="text-[#b4befe] shrink-0" />
        )}
        <span>
          {loadingProvider === 'github' ? 'Connecting to GitHub...' : 'Continue with GitHub'}
        </span>
      </button>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-[rgba(180,190,254,0.07)]" />
        <span className="font-mono-tech text-[10px] text-[#313148] uppercase tracking-widest whitespace-nowrap">
          secured by oauth 2.0
        </span>
        <div className="flex-1 h-px bg-[rgba(180,190,254,0.07)]" />
      </div>

      {/* ── Trust badges ── */}
      <div className="flex items-center justify-center gap-10 mb-7">
        {[
          { Icon: Lock,   label: 'No password\nstored',   color: '#a6e3a1' },
          { Icon: Shield, label: 'Encrypted\nsession',    color: '#89dceb' },
          { Icon: Zap,    label: 'Instant\naccess',       color: '#f9e2af' },
        ].map(({ Icon, label, color }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <Icon size={20} style={{ color }} />
            <span
              className="font-rajdhani text-[10px] uppercase tracking-wide text-center text-[#45475a] leading-tight whitespace-pre-line"
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-center font-mono-tech text-[10px] text-[#313148]">
        NO REAL MONEY · VIRTUAL TRADING ONLY
      </p>
    </div>
  );
}