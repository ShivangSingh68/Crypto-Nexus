'use client';

import { useState } from 'react';

export default function AdminSignInPage() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  return (
    <div className="card-glass-strong rounded-3xl p-8 border border-[rgba(243,139,168,0.15)]"
      style={{ boxShadow: '0 0 40px rgba(243,139,168,0.06)' }}>
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[rgba(243,139,168,0.12)] border border-[rgba(243,139,168,0.3)] flex items-center justify-center text-2xl mx-auto mb-4">
          🛡️
        </div>
        <h1 className="font-orbitron font-bold text-xl uppercase tracking-wider text-[#cdd6f4] mb-1">
          Admin Access
        </h1>
        <p className="font-rajdhani text-sm text-[#585b70]">Restricted to authorized personnel only</p>
      </div>

      <div className="mb-6">
        <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-1.5 block">Admin Key</label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter admin key..."
          className="nexus-input w-full px-4 py-3 text-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !key}
        className="neon-btn-pink w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase disabled:opacity-40"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-t-transparent border-[#f38ba8] rounded-full animate-spin" />
            Verifying...
          </span>
        ) : (
          '🛡️ Access Control Panel'
        )}
      </button>

      <p className="text-center font-mono-tech text-[10px] text-[#313148] mt-6">
        UNAUTHORIZED ACCESS IS PROHIBITED
      </p>
    </div>
  );
}