'use client';

import { useState } from 'react';

interface AdminCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  active: boolean;
  color: string;
  trades: number;
}

const MOCK_ADMIN_COINS: AdminCoin[] = [
  { id: '1', symbol: 'NXC', name: 'NexusCoin', price: 4821.33, change24h: 12.4, active: true, color: '#00f5ff', trades: 4821 },
  { id: '2', symbol: 'PHT', name: 'PhotonToken', price: 328.91, change24h: -3.2, active: true, color: '#cba6f7', trades: 1204 },
  { id: '3', symbol: 'VXL', name: 'VoxelCoin', price: 82.14, change24h: 28.7, active: true, color: '#a6e3a1', trades: 2981 },
  { id: '4', symbol: 'DRK', name: 'DarkMatter', price: 1204.5, change24h: -8.1, active: false, color: '#f38ba8', trades: 892 },
  { id: '5', symbol: 'SLR', name: 'SolarFlare', price: 56.77, change24h: 5.3, active: true, color: '#fab387', trades: 612 },
];

export default function CoinList() {
  const [coins, setCoins] = useState<AdminCoin[]>(MOCK_ADMIN_COINS);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const toggleActive = (id: string) => {
    setCoins((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCoin = (id: string) => {
    setCoins((prev) => prev.filter((c) => c.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="card-glass rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[rgba(180,190,254,0.08)] flex items-center justify-between">
        <div className="font-orbitron font-bold text-base uppercase tracking-widest text-[#cdd6f4]">
          Coin Registry
        </div>
        <span className="font-mono-tech text-xs text-[#585b70]">{coins.length} coins</span>
      </div>

      <table className="w-full nexus-table">
        <thead>
          <tr className="text-left">
            <th className="px-5 py-3 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70]">Coin</th>
            <th className="px-5 py-3 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right">Price</th>
            <th className="px-5 py-3 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right hidden sm:table-cell">24h</th>
            <th className="px-5 py-3 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-right hidden md:table-cell">Trades</th>
            <th className="px-5 py-3 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-center">Status</th>
            <th className="px-5 py-3 font-rajdhani text-xs font-semibold uppercase tracking-widest text-[#585b70] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id} className={`group ${!coin.active ? 'opacity-50' : ''}`}>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-black text-xs"
                    style={{ background: `${coin.color}15`, color: coin.color, border: `1px solid ${coin.color}30` }}
                  >
                    {coin.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-orbitron font-bold text-sm text-[#cdd6f4]">{coin.symbol}</div>
                    <div className="font-rajdhani text-xs text-[#585b70]">{coin.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-right font-mono-tech text-sm text-[#cdd6f4]">
                ${coin.price.toLocaleString()}
              </td>
              <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                <span className={`font-mono-tech text-xs ${coin.change24h >= 0 ? 'text-gain' : 'text-loss'}`}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                </span>
              </td>
              <td className="px-5 py-3.5 text-right hidden md:table-cell font-mono-tech text-xs text-[#7f849c]">
                {coin.trades.toLocaleString()}
              </td>
              <td className="px-5 py-3.5 text-center">
                <button
                  onClick={() => toggleActive(coin.id)}
                  className={`px-3 py-1 rounded-full font-rajdhani text-xs font-semibold uppercase tracking-wide transition-all ${
                    coin.active
                      ? 'bg-[rgba(166,227,161,0.12)] text-[#a6e3a1] border border-[rgba(166,227,161,0.3)]'
                      : 'bg-[rgba(243,139,168,0.12)] text-[#f38ba8] border border-[rgba(243,139,168,0.3)]'
                  }`}
                >
                  {coin.active ? 'Active' : 'Paused'}
                </button>
              </td>
              <td className="px-5 py-3.5 text-center">
                {confirmDelete === coin.id ? (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => deleteCoin(coin.id)}
                      className="font-rajdhani text-xs font-semibold text-[#f38ba8] hover:underline"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="font-rajdhani text-xs text-[#585b70] hover:text-[#cdd6f4]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(coin.id)}
                    className="font-rajdhani text-xs font-semibold text-[#585b70] hover:text-[#f38ba8] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}