"use client"

import CreateCoinForm from './components/create-coin-form';
import CoinList from './components/coin-list';
import { useStat } from './hooks/useStat';
import { handleGenerateNews, handleMonthlyRewards, handlePriceUpdate } from './action';
import { useCoins } from './hooks/useCoins';
import { toast } from '@/components/toaster';

const CONTROLS = [
  { label: 'Trigger Price Update', icon: '🔄', color: '#00f5ff', handleClick: handlePriceUpdate },
  { label: 'Generate News Cycle',  icon: '📡', color: '#cba6f7', handleClick: handleGenerateNews },
  { label: 'Run Monthly Rewards',  icon: '🏅', color: '#f9e2af', handleClick: handleMonthlyRewards },
];

const handleControl = async(btn: typeof CONTROLS[number]) => {
  try {
    await btn.handleClick();
    toast('success', btn.label, 'Operation completed successfully.');
  } catch {
    toast("error", "Action Failed", `Could not execute: ${btn.label}`);
  }
}
export default function AdminPage() {
  const { stats, loading, refetch: refetchStats } = useStat();
  const {coins, loading: coinsLoading, refetch: refetchCoins} = useCoins();

  return (
    <div className="page-wrapper">

      {/* HEADER */}
      <div className="nx-header">
        <div className="nx-header-icon">🛡️</div>
        <div>
          <div className="nx-header-title">Admin Dashboard</div>
          <div className="nx-header-sub">Nexus control panel</div>
        </div>
        <div className="nx-header-badge">
          <span className="nx-badge nx-badge-online animate-pulse-glow">System Online</span>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="nx-stat-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="nx-stat" style={{ opacity: 0.4 }}>
                <span className="nx-stat-icon">⬡</span>
                <span className="nx-stat-val" style={{ color: '#585b70', background: 'rgba(180,190,254,0.08)', borderRadius: '6px', minWidth: '4rem', height: '1.4rem', display: 'block' }} />
                <span className="nx-stat-lbl" style={{ background: 'rgba(180,190,254,0.06)', borderRadius: '4px', minWidth: '3rem', height: '0.65rem', display: 'block' }} />
              </div>
            ))
          : stats.map((s) => (
              <div key={s.label} className="nx-stat">
                <span className="nx-stat-icon">{s.icon}</span>
                <span className="nx-stat-val" style={{ color: s.color }}>{s.value}</span>
                <span className="nx-stat-lbl">{s.label}</span>
              </div>
            ))
        }
      </div>

      {/* MAIN LAYOUT */}
      <div className="nx-layout">

        {/* LEFT COLUMN */}
        <div className="nx-left">

          {/* Create Coin */}
          <div className="nx-card">
            <CreateCoinForm  onCreated={() => {
              refetchStats();
              refetchCoins();
            }}/>
          </div>

          {/* Dashboard Controls */}
          <div className="nx-card">
            <div className="nx-section-title">Dashboard Controls</div>
            <div className="nx-ctrl-list">
              {CONTROLS.map((btn) => (
                <button
                  key={btn.label}
                  className="nx-ctrl-btn"
                  style={{ color: btn.color }}
                  onClick={() => handleControl(btn)}
                >
                  <span>{btn.icon}</span>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="nx-card">
          <CoinList coins={coins} loading={coinsLoading} onDelete={() => {
              refetchCoins();
              refetchStats();
          }}/>
        </div>

      </div>
    </div>
  );
}