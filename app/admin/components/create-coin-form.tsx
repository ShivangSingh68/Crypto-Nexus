'use client';

import { useState } from 'react';

interface CoinFormData {
  symbol: string;
  name: string;
  initialPrice: string;
  maxSupply: string;
  description: string;
  color: string;
}

const COLOR_PRESETS = ['#00f5ff', '#cba6f7', '#a6e3a1', '#f38ba8', '#fab387', '#f9e2af', '#89dceb', '#b4befe'];

export default function CreateCoinForm() {
  const [form, setForm] = useState<CoinFormData>({
    symbol: '', name: '', initialPrice: '', maxSupply: '', description: '', color: '#00f5ff',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.symbol || !form.name || !form.initialPrice) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);
    setForm({ symbol: '', name: '', initialPrice: '', maxSupply: '', description: '', color: '#00f5ff' });
    setTimeout(() => setSuccess(false), 3000);
  };

  const set = (k: keyof CoinFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="card-glass rounded-2xl p-6">
      <div className="font-orbitron font-bold text-base uppercase tracking-widest text-[#cdd6f4] mb-6">
        + Create New Coin
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-1.5 block">Symbol *</label>
          <input value={form.symbol} onChange={set('symbol')} placeholder="NXC" maxLength={5}
            className="nexus-input w-full px-4 py-2.5 text-sm uppercase" />
        </div>
        <div>
          <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-1.5 block">Name *</label>
          <input value={form.name} onChange={set('name')} placeholder="NexusCoin"
            className="nexus-input w-full px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-1.5 block">Initial Price (USD) *</label>
          <input value={form.initialPrice} onChange={set('initialPrice')} placeholder="1000.00" type="number" min={0}
            className="nexus-input w-full px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-1.5 block">Max Supply</label>
          <input value={form.maxSupply} onChange={set('maxSupply')} placeholder="21000000" type="number" min={0}
            className="nexus-input w-full px-4 py-2.5 text-sm" />
        </div>
      </div>

      <div className="mb-4">
        <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-1.5 block">Description</label>
        <textarea value={form.description} onChange={set('description')} placeholder="Describe this coin..."
          rows={2} className="nexus-input w-full px-4 py-2.5 text-sm resize-none" />
      </div>

      {/* Color picker */}
      <div className="mb-6">
        <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-2 block">Coin Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => setForm((p) => ({ ...p, color: c }))}
              className="w-8 h-8 rounded-lg transition-all"
              style={{
                background: c,
                boxShadow: form.color === c ? `0 0 12px ${c}` : undefined,
                border: form.color === c ? `2px solid white` : `2px solid transparent`,
                transform: form.color === c ? 'scale(1.15)' : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* Preview */}
      {form.symbol && (
        <div className="mb-6 p-4 rounded-xl bg-[rgba(17,17,27,0.6)] border border-[rgba(180,190,254,0.08)] flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-orbitron font-black text-sm"
            style={{ background: `${form.color}18`, color: form.color, border: `1px solid ${form.color}33` }}
          >
            {form.symbol.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-orbitron font-bold text-sm" style={{ color: form.color }}>{form.symbol.toUpperCase()}</div>
            <div className="font-rajdhani text-xs text-[#585b70]">{form.name || 'Unnamed'}</div>
          </div>
          <div className="ml-auto font-mono-tech text-sm text-[#cdd6f4]">
            ${parseFloat(form.initialPrice || '0').toLocaleString()}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !form.symbol || !form.name || !form.initialPrice}
        className={`w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
          success
            ? 'bg-[rgba(166,227,161,0.2)] text-[#a6e3a1] border border-[rgba(166,227,161,0.4)]'
            : 'neon-btn-cyan'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-t-transparent border-[#00f5ff] rounded-full animate-spin" />
            Creating...
          </span>
        ) : success ? (
          '✓ Coin Created!'
        ) : (
          'Create Coin'
        )}
      </button>
    </div>
  );
}