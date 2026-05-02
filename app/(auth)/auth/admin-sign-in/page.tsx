'use client';

import { useState } from 'react';
import { Chrome, Github, ShieldCheck, ShieldAlert, ChevronLeft } from 'lucide-react';
import { handleOAuth } from '../action';

type Step = 'oauth' | 'key';

export default function AdminSignInPage() {
  const [step, setStep]                     = useState<Step>('oauth');
  const [selectedProvider, setProvider]    = useState<'google' | 'github' | null>(null);
  const [loadingProvider, setLoadingProv]  = useState<'google' | 'github' | null>(null);
  const [adminKey, setAdminKey]            = useState('');
  const [verifying, setVerifying]          = useState(false);
  const [keyError, setKeyError]            = useState(false);

  const handleOAuthBtn = async (provider: 'google' | 'github') => {
    setLoadingProv(provider);
    await handleOAuth(provider);
    setLoadingProv(null);
    setProvider(provider);
    setStep('key');
  };

  const handleVerifyKey = async () => {
    if (!adminKey) return;
    setVerifying(true);
    setKeyError(false);
    await new Promise((r) => setTimeout(r, 900));
    setVerifying(false);
    if (adminKey !== 'nexus-admin') { setKeyError(true); return; }
    // Replace with: router.push('/admin')
  };

  const reset = () => {
    setStep('oauth');
    setProvider(null);
    setAdminKey('');
    setKeyError(false);
  };

  const isLoading = loadingProvider !== null;

  return (
    <div
      className="card-glass-strong rounded-3xl p-10 border border-[rgba(243,139,168,0.15)]"
      style={{ boxShadow: '0 0 40px rgba(243,139,168,0.06)' }}
    >
      {/* ── Header ── */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[rgba(243,139,168,0.12)] border border-[rgba(243,139,168,0.3)] flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={28} className="text-[#f38ba8]" />
        </div>
        <h1 className="font-orbitron font-bold text-xl uppercase tracking-wider text-[#cdd6f4] mb-1">
          Admin Access
        </h1>
        <p className="font-rajdhani text-sm text-[#585b70]">Restricted to authorized personnel only</p>
      </div>

      {/* ── Step indicator ── */}
      <div className="flex items-center gap-2 mb-8">
        {(['oauth', 'key'] as Step[]).map((s, i) => {
          const done   = i < (['oauth', 'key'] as Step[]).indexOf(step);
          const active = step === s;
          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-orbitron text-[10px] font-bold border transition-all ${
                active ? 'bg-[rgba(243,139,168,0.2)] border-[rgba(243,139,168,0.5)] text-[#f38ba8]'
                : done  ? 'bg-[rgba(166,227,161,0.15)] border-[rgba(166,227,161,0.4)] text-[#a6e3a1]'
                        : 'bg-[rgba(180,190,254,0.05)] border-[rgba(180,190,254,0.1)] text-[#45475a]'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`font-rajdhani text-xs uppercase tracking-wider ${active ? 'text-[#f38ba8]' : 'text-[#45475a]'}`}>
                {s === 'oauth' ? 'Sign In' : 'Admin Key'}
              </span>
              {i < 1 && <div className="flex-1 h-px bg-[rgba(180,190,254,0.1)]" />}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: OAuth ── */}
      {step === 'oauth' && (
        <div className="flex flex-col gap-3">
          <p className="font-rajdhani text-xs uppercase tracking-widest text-[#45475a] text-center mb-1">
            Authenticate via
          </p>

          {/* Google */}
          <button
            onClick={() => handleOAuthBtn('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 h-14 px-5 rounded-xl font-rajdhani font-semibold text-base tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-[rgba(180,190,254,0.12)] bg-[rgba(66,133,244,0.07)] text-[#cdd6f4] hover:bg-[rgba(66,133,244,0.15)] hover:border-[rgba(66,133,244,0.4)] hover:shadow-[0_0_18px_rgba(66,133,244,0.2)] hover:-translate-y-0.5"
          >
            {loadingProvider === 'google' ? (
              <span className="w-5 h-5 border-2 border-t-transparent border-[#4285F4] rounded-full animate-spin" />
            ) : (
              <Chrome size={20} className="text-[#4285F4] shrink-0" />
            )}
            <span>{loadingProvider === 'google' ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          {/* GitHub */}
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
            <span>{loadingProvider === 'github' ? 'Connecting...' : 'Continue with GitHub'}</span>
          </button>
        </div>
      )}

      {/* ── STEP 2: Admin Key ── */}
      {step === 'key' && (
        <div>
          {/* Authenticated pill */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[rgba(166,227,161,0.08)] border border-[rgba(166,227,161,0.2)] mb-5">
            <ShieldCheck size={14} className="text-[#a6e3a1] shrink-0" />
            <span className="font-rajdhani text-xs text-[#a6e3a1]">
              Signed in via {selectedProvider === 'google' ? 'Google' : 'GitHub'} — verify admin access
            </span>
          </div>

          <div className="mb-5">
            <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-1.5 block">
              Admin Key
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => { setAdminKey(e.target.value); setKeyError(false); }}
              placeholder="Enter admin key..."
              className={`nexus-input w-full px-4 py-3 text-sm ${keyError ? 'border-[rgba(243,139,168,0.5)]' : ''}`}
            />
            {keyError && (
              <p className="font-rajdhani text-xs text-[#f38ba8] mt-1.5 flex items-center gap-1">
                <ShieldAlert size={12} /> Invalid admin key. Access denied.
              </p>
            )}
          </div>

          <button
            onClick={handleVerifyKey}
            disabled={verifying || !adminKey}
            className="neon-btn-pink w-full h-12 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {verifying ? (
              <>
                <span className="w-4 h-4 border-2 border-t-transparent border-[#f38ba8] rounded-full animate-spin" />
                Verifying Key...
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                Enter Control Panel
              </>
            )}
          </button>

          <button
            onClick={reset}
            className="w-full mt-3 flex items-center justify-center gap-1 font-rajdhani text-xs text-[#45475a] hover:text-[#7f849c] transition-colors"
          >
            <ChevronLeft size={14} /> Use a different account
          </button>
        </div>
      )}

      <p className="text-center font-mono-tech text-[10px] text-[#313148] mt-6">
        UNAUTHORIZED ACCESS IS PROHIBITED
      </p>
    </div>
  );
}