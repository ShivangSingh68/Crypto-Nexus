'use client';

import { useState } from 'react';
import { deleteCoinAction } from '../action';
import { AdminCoin } from '../type';


interface Props {
  coins: AdminCoin[],
  loading: boolean,
  onDelete?: () => void,
}
export default function CoinList({ coins, loading, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const deleteCoin = async (id: string) => {
    setDeleting(id);
    await deleteCoinAction(id);
    onDelete?.();
    setDeleting(null);
    setConfirmDelete(null);
  };

  return (
    <>
      <div className="nx-section-title">
        Coin Registry
        <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.75rem', color: 'var(--text-overlay2)', marginLeft: 'auto', textTransform: 'none', letterSpacing: 0 }}>
          {loading ? '...' : `${coins.length} coins`}
        </span>
      </div>

      <div className="nx-table-wrap">
        <table className="nx-table">
          <thead>
            <tr>
              <th>Coin</th>
              <th className="right">Price</th>
              <th className="right">24h</th>
              <th className="right">Trades</th>
              <th className="center">Status</th>
              <th className="center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ opacity: 0.35 }}>
                    <td>
                      <div className="nx-coin-id">
                        <div className="nx-coin-icon" style={{ background: 'rgba(180,190,254,0.08)', border: '1px solid rgba(180,190,254,0.1)' }} />
                        <div>
                          <div className="nx-coin-name" style={{ background: 'rgba(180,190,254,0.08)', borderRadius: '4px', width: '3rem', height: '0.8rem' }} />
                          <div className="nx-coin-sub" style={{ background: 'rgba(180,190,254,0.05)', borderRadius: '4px', width: '5rem', height: '0.65rem', marginTop: '4px' }} />
                        </div>
                      </div>
                    </td>
                    <td className="right"><div style={{ background: 'rgba(180,190,254,0.08)', borderRadius: '4px', width: '4rem', height: '0.8rem', marginLeft: 'auto' }} /></td>
                    <td className="right"><div style={{ background: 'rgba(180,190,254,0.08)', borderRadius: '4px', width: '2.5rem', height: '0.8rem', marginLeft: 'auto' }} /></td>
                    <td className="right"><div style={{ background: 'rgba(180,190,254,0.08)', borderRadius: '4px', width: '2rem', height: '0.8rem', marginLeft: 'auto' }} /></td>
                    <td className="center"><div style={{ background: 'rgba(180,190,254,0.08)', borderRadius: '999px', width: '4rem', height: '1.4rem', margin: '0 auto' }} /></td>
                    <td className="center"><div style={{ background: 'rgba(180,190,254,0.08)', borderRadius: '4px', width: '2.5rem', height: '0.8rem', margin: '0 auto' }} /></td>
                  </tr>
                ))
              : coins.map((coin) => (
                  <tr key={coin.id}>
                    <td>
                      <div className="nx-coin-id">
                        <div
                          className="nx-coin-icon"
                          style={{
                            background: `${coin.color}15`,
                            color: coin.color,
                            border: `1px solid ${coin.color}30`,
                          }}
                        >
                          {coin.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="nx-coin-name">{coin.symbol}</div>
                          <div className="nx-coin-sub">{coin.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="right" style={{ fontFamily: 'Share Tech Mono', fontSize: '0.9rem' }}>
                      ${coin.price.toLocaleString()}
                    </td>
                    <td className="right">
                      <span className={coin.change24h >= 0 ? 'text-gain' : 'text-loss'} style={{ fontFamily: 'Share Tech Mono', fontSize: '0.8rem' }}>
                        {coin.change24h >= 0 ? '+' : ''}{(coin.change24h*100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="right" style={{ fontFamily: 'Share Tech Mono', fontSize: '0.8rem', color: 'var(--text-overlay1)' }}>
                      {coin.trades.toLocaleString()}
                    </td>
                    <td className="center">
                      <span className={coin.active ? 'nx-badge nx-badge-active' : 'nx-badge nx-badge-paused'}>
                        {coin.active ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="center">
                      {confirmDelete === coin.id ? (
                        <div className="nx-delete-group">
                          <button
                            onClick={() => deleteCoin(coin.id)}
                            className="nx-delete-btn"
                            style={{ color: '#f38ba8', opacity: deleting === coin.id ? 0.5 : 1 }}
                            disabled={deleting === coin.id}
                          >
                            {deleting === coin.id ? '...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="nx-delete-btn"
                            style={{ color: 'var(--text-overlay2)' }}
                            disabled={deleting === coin.id}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(coin.id)}
                          className="nx-delete-btn"
                          style={{ color: 'var(--text-overlay2)' }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
}