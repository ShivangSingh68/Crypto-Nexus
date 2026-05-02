import CreateCoinForm from './components/create-coin-form';
import CoinList from './components/coin-list';

const STATS = [
  { label: 'Total Users', value: '12,841', icon: '👥', color: '#00f5ff' },
  { label: 'Total Coins', value: '12', icon: '⬡', color: '#cba6f7' },
  { label: 'Trades Today', value: '8,492', icon: '⚡', color: '#a6e3a1' },
  { label: 'Volume 24h', value: '$594.7M', icon: '📊', color: '#f9e2af' },
  { label: 'Active Users', value: '3,241', icon: '🟢', color: '#fab387' },
  { label: 'News Generated', value: '48', icon: '📡', color: '#f38ba8' },
];

export default function AdminPage() {
  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[rgba(243,139,168,0.15)] border border-[rgba(243,139,168,0.3)] flex items-center justify-center text-lg">
          🛡️
        </div>
        <div>
          <h1 className="font-orbitron font-black text-2xl uppercase tracking-widest text-[#cdd6f4]">
            Admin Dashboard
          </h1>
          <p className="font-rajdhani text-[#7f849c] text-sm">Nexus control panel</p>
        </div>
        <span className="ml-auto badge badge-bullish animate-pulse-glow">System Online</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="card-glass rounded-2xl p-4">
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="font-orbitron font-bold text-lg" style={{ color: s.color }}>{s.value}</div>
            <div className="font-rajdhani text-[10px] text-[#585b70] uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create coin form */}
        <div className="lg:col-span-1">
          <CreateCoinForm />

          {/* Controls */}
          <div className="card-glass rounded-2xl p-5 mt-4">
            <div className="font-orbitron font-bold text-sm uppercase tracking-widest text-[#cdd6f4] mb-4">
              Dashboard Controls
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Trigger Price Update', icon: '🔄', color: '#00f5ff' },
                { label: 'Generate News Cycle', icon: '📡', color: '#cba6f7' },
                { label: 'Run Monthly Rewards', icon: '🏅', color: '#f9e2af' },
                { label: 'Reset Market Prices', icon: '⚠️', color: '#f38ba8' },
              ].map((btn) => (
                <button
                  key={btn.label}
                  className="w-full text-left px-4 py-2.5 rounded-xl font-rajdhani font-semibold text-sm transition-all bg-[rgba(180,190,254,0.04)] border border-[rgba(180,190,254,0.08)] hover:bg-[rgba(180,190,254,0.1)] flex items-center gap-2"
                  style={{ color: btn.color }}
                >
                  <span>{btn.icon}</span>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coin list */}
        <div className="lg:col-span-2">
          <CoinList />
        </div>
      </div>
    </div>
  );
}