'use client';

import { useState } from 'react';
import { useMarketData } from './hooks/useMarketData';
import CoinCard from './components/coin-card';
import MarketTable from './components/market-table';

export default function MarketPage() {
  const { coins, search, setSearch, sortBy, setSortBy, sortDir, setSortDir, marketCap, loading } = useMarketData();
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="card-glass rounded-2xl" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }} className="animate-pulse">📈</div>
          <p className="font-rajdhani" style={{ color: '#585b70' }}>Loading market data...</p>
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

  const filtered = coins!.filter((c) => {
    if (filter === 'gainers') return !c.change24h.includes('-');
    if (filter === 'losers') return c.change24h.includes('-');
    return true;
  });

  const gainers = coins.filter((c) => !c.change24h.includes('-')).length;
  const losers = coins.filter((c) => c.change24h.includes('-')).length;

  const stats = [
    { label: 'Total Coins', value: coins.length, color: '#b4befe' },
    { label: 'Gainers',     value: gainers,       color: '#a6e3a1' },
    { label: 'Losers',      value: losers,         color: '#f38ba8' },
    { label: 'Mkt Cap',     value: marketCap.toFixed(2),      color: '#00f5ff' },
  ];

  return (
    <div className="page-wrapper">

      {/* ── Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="live-dot font-orbitron" style={{ fontSize: '0.75rem', color: '#00f5ff', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Live
          </span>
        </div>
        <h1 className="font-orbitron" style={{ fontWeight: 900, fontSize: '1.875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#cdd6f4', marginBottom: '0.25rem' }}>
          Market
        </h1>
        <p className="font-rajdhani" style={{ color: '#7f849c' }}>Real-time simulated crypto prices</p>
      </div>

      {/* ── Stats Bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
        {stats.map((s) => (
          <div key={s.label} className="card-glass" style={{ borderRadius: '1rem', padding: '0.75rem 1rem' }}>
            <div className="font-rajdhani" style={{ fontSize: '0.7rem', color: '#585b70', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              {s.label}
            </div>
            <div className="font-orbitron" style={{ fontWeight: 700, fontSize: '1.25rem', color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#585b70', fontSize: '1rem', pointerEvents: 'none' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search coins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="nexus-input"
            style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '1rem', paddingTop: '0.625rem', paddingBottom: '0.625rem', fontSize: '0.875rem' }}
          />
        </div>

        {/* Filter tabs */}
        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '0.75rem', padding: '0.25rem' }}>
          {(['all', 'gainers', 'losers'] as const).map((f) => {
            const active = filter === f;
            const activeStyle = f === 'gainers'
              ? { background: 'rgba(166,227,161,0.15)', color: '#a6e3a1', border: '1px solid rgba(166,227,161,0.3)' }
              : f === 'losers'
              ? { background: 'rgba(243,139,168,0.15)', color: '#f38ba8', border: '1px solid rgba(243,139,168,0.3)' }
              : { background: 'rgba(180,190,254,0.12)', color: '#b4befe', border: '1px solid rgba(180,190,254,0.25)' };
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="font-rajdhani"
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: '1px solid transparent',
                  ...(active ? activeStyle : { background: 'transparent', color: '#585b70' }),
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* View toggle */}
        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '0.75rem', padding: '0.25rem' }}>
          {([
            { key: 'grid', icon: '▦' },
            { key: 'table', icon: '☰' },
          ] as const).map(({ key, icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                border: 'none',
                background: view === key ? 'rgba(0,245,255,0.12)' : 'transparent',
                color: view === key ? '#00f5ff' : '#585b70',
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="card-glass" style={{ borderRadius: '1rem', padding: '5rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
          <p className="font-rajdhani" style={{ color: '#585b70' }}>No coins match your search.</p>
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
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