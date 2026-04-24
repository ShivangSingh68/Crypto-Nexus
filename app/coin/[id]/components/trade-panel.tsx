'use client';

import { useState } from 'react';
import type { CoinDetail } from '../hooks/useCoin';

interface TradePanelProps {
  coin: CoinDetail;
}

export default function TradePanel({ coin }: TradePanelProps) {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const balance = 25000;
  const holdings = 0.42;

  const qty = parseFloat(amount) || 0;
  const total = qty * coin.price;
  const maxBuy = balance / coin.price;

  const handleTrade = () => {
    if (!qty) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setAmount('');
  };

  const pcts = [0.25, 0.5, 0.75, 1];

  return (
    <div className="card-glass rounded-2xl p-5">
      <div className="font-rajdhani text-xs uppercase tracking-widest text-[#585b70] mb-4">Trade</div>

      {/* Buy / Sell toggle */}
      <div className="flex rounded-xl overflow-hidden border border-[rgba(180,190,254,0.1)] mb-5">
        <button
          onClick={() => setMode('buy')}
          className={`flex-1 py-2.5 font-orbitron text-xs font-bold tracking-widest uppercase transition-all ${
            mode === 'buy'
              ? 'bg-[rgba(166,227,161,0.15)] text-[#a6e3a1]'
              : 'text-[#585b70] hover:text-[#a6adc8]'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setMode('sell')}
          className={`flex-1 py-2.5 font-orbitron text-xs font-bold tracking-widest uppercase transition-all ${
            mode === 'sell'
              ? 'bg-[rgba(243,139,168,0.15)] text-[#f38ba8]'
              : 'text-[#585b70] hover:text-[#a6adc8]'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Balance info */}
      <div className="flex justify-between mb-4 text-xs">
        <span className="font-rajdhani text-[#585b70] uppercase tracking-wider">
          {mode === 'buy' ? 'Available' : 'Holdings'}
        </span>
        <span className="font-mono-tech text-[#b4befe]">
          {mode === 'buy' ? `$${balance.toLocaleString()}` : `${holdings} ${coin.symbol}`}
        </span>
      </div>

      {/* Amount input */}
      <div className="mb-3">
        <label className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70] mb-1.5 block">
          Quantity ({coin.symbol})
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min={0}
            className="nexus-input w-full px-4 py-3 text-sm pr-16"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-orbitron text-xs text-[#585b70]">
            {coin.symbol}
          </span>
        </div>
      </div>

      {/* Quick pct buttons */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {pcts.map((p) => (
          <button
            key={p}
            onClick={() =>
              setAmount(
                mode === 'buy'
                  ? (maxBuy * p).toFixed(6)
                  : (holdings * p).toFixed(6)
              )
            }
            className="py-1.5 rounded-lg font-rajdhani text-xs font-semibold text-[#7f849c] bg-[rgba(180,190,254,0.06)] border border-[rgba(180,190,254,0.08)] hover:text-[#b4befe] hover:border-[rgba(180,190,254,0.2)] transition-all"
          >
            {p * 100}%
          </button>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between mb-5 px-3 py-2.5 rounded-xl bg-[rgba(17,17,27,0.6)] border border-[rgba(180,190,254,0.08)]">
        <span className="font-rajdhani text-xs uppercase tracking-wider text-[#585b70]">Total</span>
        <span className="font-mono-tech text-sm text-[#cdd6f4]">
          ${total > 0 ? total.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
        </span>
      </div>

      {/* Submit */}
      <button
        onClick={handleTrade}
        disabled={!qty}
        className={`w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
          submitted
            ? 'bg-[rgba(166,227,161,0.3)] text-[#a6e3a1] border border-[rgba(166,227,161,0.4)]'
            : mode === 'buy'
            ? 'neon-btn-cyan'
            : 'neon-btn-pink'
        }`}
      >
        {submitted ? '✓ Order Placed!' : mode === 'buy' ? `Buy ${coin.symbol}` : `Sell ${coin.symbol}`}
      </button>

      {/* Disclaimer */}
      <p className="font-rajdhani text-[10px] text-[#45475a] text-center mt-3 leading-relaxed">
        Virtual trading only. No real money involved.
      </p>
    </div>
  );
}