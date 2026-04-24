interface PnlCardProps {
  label: string;
  value: string;
  sub?: string;
  isGain?: boolean;
  isLoss?: boolean;
  color?: string;
  icon?: string;
}

export default function PnlCard({ label, value, sub, isGain, isLoss, color = '#b4befe', icon }: PnlCardProps) {
  const textColor = isGain ? '#a6e3a1' : isLoss ? '#f38ba8' : color;
  const glowStyle = isGain
    ? { boxShadow: '0 0 30px rgba(166,227,161,0.08)' }
    : isLoss
    ? { boxShadow: '0 0 30px rgba(243,139,168,0.08)' }
    : {};

  return (
    <div className="card-glass rounded-2xl p-5 hover-lift" style={glowStyle}>
      {icon && <div className="text-2xl mb-3">{icon}</div>}
      <div className="font-rajdhani text-xs uppercase tracking-widest text-[#585b70] mb-1">{label}</div>
      <div
        className={`font-mono-tech text-2xl font-bold ${isGain ? 'text-gain glow-gain' : isLoss ? 'text-loss glow-loss' : ''}`}
        style={{ color: textColor }}
      >
        {value}
      </div>
      {sub && <div className="font-rajdhani text-xs text-[#585b70] mt-1">{sub}</div>}
    </div>
  );
}