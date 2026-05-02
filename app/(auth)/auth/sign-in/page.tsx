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
    <div className="card-glass-strong" style={{ borderRadius: '1.5rem', padding: '2.5rem', maxWidth: '420px', width: '100%', margin: '0 auto' }}>

      {/* ── Logo ── */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div
            className="glow-cyan"
            style={{
              width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #00f5ff, #cba6f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span className="font-orbitron" style={{ color: '#0d0b14', fontWeight: 900, fontSize: '0.875rem' }}>N</span>
          </div>
          <span className="font-orbitron text-glow-cyan" style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00f5ff' }}>
            Crypto<span style={{ color: '#cba6f7' }}>Nexus</span>
          </span>
        </div>
        <h1 className="font-orbitron" style={{ fontWeight: 700, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#cdd6f4', marginBottom: '0.5rem' }}>
          Welcome Back
        </h1>
        <p className="font-rajdhani" style={{ fontSize: '1rem', color: '#585b70' }}>
          Sign in to your trading account
        </p>
      </div>

      {/* ── Label ── */}
      <p className="font-rajdhani" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#45475a', textAlign: 'center', marginBottom: '1rem' }}>
        Choose your login method
      </p>

      {/* ── Google ── */}
      <button
        onClick={() => handleOAuthBtn('google')}
        disabled={isLoading}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.75rem', height: '3.5rem', padding: '0 1.25rem', borderRadius: '0.75rem',
          marginBottom: '0.75rem', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em',
          transition: 'all 0.2s ease', cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.5 : 1,
          border: '1px solid rgba(180,190,254,0.12)',
          background: 'rgba(66,133,244,0.07)', color: '#cdd6f4',
        }}
        onMouseEnter={e => {
          if (!isLoading) {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(66,133,244,0.15)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(66,133,244,0.4)';
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(66,133,244,0.07)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(180,190,254,0.12)';
        }}
      >
        {loadingProvider === 'google' ? (
          <span style={{ width: '1.25rem', height: '1.25rem', border: '2px solid #4285F4', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
        ) : (
          <Chrome size={20} style={{ color: '#4285F4', flexShrink: 0 }} />
        )}
        <span className="font-rajdhani">
          {loadingProvider === 'google' ? 'Connecting to Google...' : 'Continue with Google'}
        </span>
      </button>

      {/* ── GitHub ── */}
      <button
        onClick={() => handleOAuthBtn('github')}
        disabled={isLoading}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.75rem', height: '3.5rem', padding: '0 1.25rem', borderRadius: '0.75rem',
          fontWeight: 600, fontSize: '1rem', letterSpacing: '0.05em',
          transition: 'all 0.2s ease', cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.5 : 1,
          border: '1px solid rgba(180,190,254,0.12)',
          background: 'rgba(180,190,254,0.05)', color: '#cdd6f4',
        }}
        onMouseEnter={e => {
          if (!isLoading) {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(180,190,254,0.12)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(180,190,254,0.35)';
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(180,190,254,0.05)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(180,190,254,0.12)';
        }}
      >
        {loadingProvider === 'github' ? (
          <span style={{ width: '1.25rem', height: '1.25rem', border: '2px solid #b4befe', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
        ) : (
          <Github size={20} style={{ color: '#b4befe', flexShrink: 0 }} />
        )}
        <span className="font-rajdhani">
          {loadingProvider === 'github' ? 'Connecting to GitHub...' : 'Continue with GitHub'}
        </span>
      </button>

      {/* ── Divider ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.75rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(180,190,254,0.07)' }} />
        <span className="font-mono-tech" style={{ fontSize: '0.625rem', color: '#313148', textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>
          secured by oauth 2.0
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(180,190,254,0.07)' }} />
      </div>

      {/* ── Trust badges ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', marginBottom: '1.75rem' }}>
        {[
          { Icon: Lock,   label: 'No password\nstored',  color: '#a6e3a1' },
          { Icon: Shield, label: 'Encrypted\nsession',   color: '#89dceb' },
          { Icon: Zap,    label: 'Instant\naccess',      color: '#f9e2af' },
        ].map(({ Icon, label, color }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Icon size={20} style={{ color }} />
            <span className="font-rajdhani" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', color: '#45475a', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono-tech" style={{ textAlign: 'center', fontSize: '0.625rem', color: '#313148' }}>
        NO REAL MONEY · VIRTUAL TRADING ONLY
      </p>
    </div>
  );
}