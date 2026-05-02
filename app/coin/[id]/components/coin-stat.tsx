interface CoinStatProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  highlight?: boolean;
}

export default function CoinStat({ label, value, sub, color = '#b4befe'}: CoinStatProps) {
  return (
    <div className="nx-stat" style={{ borderColor: `${color}22`, boxShadow: `0 0 16px ${color}10` }}>
      <div className="font-rajdhani" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#585b70' }}>
        {label}
      </div>
      <div className="font-mono-tech" style={{ fontSize: '1rem', fontWeight: 700, color, textShadow: `0 0 10px ${color}66` }}>
        {value}
      </div>
      {sub && (
        <div className="font-rajdhani" style={{ fontSize: '0.72rem', color: '#585b70', marginTop: '0.15rem' }}>
          {sub}
        </div>
      )}
    </div>
  );
}