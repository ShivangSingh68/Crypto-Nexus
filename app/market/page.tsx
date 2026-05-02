'use client';

import { useState } from 'react';
import { useMarketData } from './hooks/useMarketData';
import CoinCard from './components/coin-card';
import MarketTable from './components/market-table';

export default function MarketPage() {
  const { coins, search, setSearch, sortBy, setSortBy, sortDir, setSortDir, loading } = useMarketData();
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="card-glass rounded-2xl py-20 text-center">
          <div className="text-4xl mb-3 animate-pulse">📈</div>
          <p className="font-rajdhani text-[#585b70]">
            Loading market data...
          </p>
        </div>
      </div>
    );
  }

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(col);
      setSortDir('desc');
    }
  };

  const filtered = coins.filter((c) => {
    if (filter === 'gainers') return c.change24h > 0;
    if (filter === 'losers') return c.change24h < 0;
    return true;
  });

  const gainers = coins.filter((c) => c.change24h > 0).length;
  const losers = coins.filter((c) => c.change24h < 0).length;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="live-dot font-orbitron text-xs text-[#00f5ff] tracking-widest uppercase">Live</span>
        </div>
        <h1 className="font-orbitron font-black text-3xl uppercase tracking-widest text-[#cdd6f4] mb-1">
          Market
        </h1>
        <p className="font-rajdhani text-[#7f849c]">Real-time simulated crypto prices</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Coins', value: coins.length, color: '#b4befe' },
          { label: 'Gainers', value: gainers, color: '#a6e3a1' },
          { label: 'Losers', value: losers, color: '#f38ba8' },
          { label: 'Mkt Cap', value: '$192.5B', color: '#00f5ff' },
        ].map((s) => (
          <div key={s.label} className="card-glass rounded-2xl px-4 py-3">
            <div className="font-rajdhani text-xs text-[#585b70] uppercase tracking-wider mb-1">{s.label}</div>
            <div className="font-orbitron font-bold text-lg" style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#585b70] text-sm">⌕</span>
          <input
            type="text"
            placeholder="Search coins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="nexus-input w-full pl-8 pr-4 py-2.5 text-sm"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 card-glass rounded-xl p-1">
          {(['all', 'gainers', 'losers'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-rajdhani font-semibold text-xs uppercase tracking-widest transition-all ${
                filter === f
                  ? f === 'gainers'
                    ? 'bg-[rgba(166,227,161,0.15)] text-[#a6e3a1] border border-[rgba(166,227,161,0.3)]'
                    : f === 'losers'
                    ? 'bg-[rgba(243,139,168,0.15)] text-[#f38ba8] border border-[rgba(243,139,168,0.3)]'
                    : 'bg-[rgba(180,190,254,0.12)] text-[#b4befe] border border-[rgba(180,190,254,0.25)]'
                  : 'text-[#585b70] hover:text-[#a6adc8]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 card-glass rounded-xl p-1">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-2 rounded-lg transition-all ${view === 'grid' ? 'bg-[rgba(0,245,255,0.12)] text-[#00f5ff]' : 'text-[#585b70] hover:text-[#a6adc8]'}`}
          >
            ⊞
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-3 py-2 rounded-lg transition-all ${view === 'table' ? 'bg-[rgba(0,245,255,0.12)] text-[#00f5ff]' : 'text-[#585b70] hover:text-[#a6adc8]'}`}
          >
            ≡
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="card-glass rounded-2xl py-20 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-rajdhani text-[#585b70]">No coins match your search.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
      ) : (
        <MarketTable coins={filtered} sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
      )}
    </div>
  );
}