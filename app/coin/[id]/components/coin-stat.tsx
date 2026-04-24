interface CoinStatProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  highlight?: boolean;
}

export default function CoinStat({ label, value, sub, color = '#b4befe', highlight }: CoinStatProps) {
  return (
    <div
      className={`card-glass rounded-2xl p-4 ${highlight ? 'border-[rgba(0,245,255,0.2)]' : ''}`}
      style={highlight ? { boxShadow: '0 0 20px rgba(0,245,255,0.08)' } : {}}
    >
      <div className="font-rajdhani text-xs uppercase tracking-widest text-[#585b70] mb-1">{label}</div>
      <div className="font-mono-tech text-base font-bold" style={{ color }}>
        {value}
      </div>
      {sub && <div className="font-rajdhani text-xs text-[#585b70] mt-0.5">{sub}</div>}
    </div>
  );
}