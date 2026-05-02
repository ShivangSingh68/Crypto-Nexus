'use client';

interface PnlCardProps {
  label: string;
  value: string;
  sub?: string;
  isGain?: boolean;
  isLoss?: boolean;
  color?: string;
  icon?: string;
}

export default function PnlCard({
  label,
  value,
  sub,
  isGain,
  isLoss,
  color = '#b4befe',
  icon,
}: PnlCardProps) {
  const textColor = isGain ? '#a6e3a1' : isLoss ? '#f38ba8' : color;
  const accentColor = isGain ? '#a6e3a1' : isLoss ? '#f38ba8' : color;

  return (
    <div
      className="rounded-3xl relative overflow-hidden hover-lift flex flex-col"
      style={{
        background: 'rgba(24,24,37,0.85)',
        border: `1px solid ${accentColor}22`,
        padding: '2rem 1.75rem',
        gap: '1rem',
        minHeight: '160px',
      }}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}55, transparent)` }}
      />

      {/* Icon badge */}
      {icon && (
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}25` }}
        >
          {icon}
        </div>
      )}

      {/* Label */}
      <p
        className="font-rajdhani uppercase tracking-[0.16em]"
        style={{ fontSize: '11px', color: '#6c7086', marginTop: 'auto' }}
      >
        {label}
      </p>

      {/* Value */}
      <p
        className={`font-mono-tech font-bold leading-none tracking-tight ${
          isGain ? 'text-gain glow-gain' : isLoss ? 'text-loss glow-loss' : ''
        }`}
        style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)', color: textColor }}
      >
        {value}
      </p>

      {sub && (
        <p className="font-rajdhani text-xs" style={{ color: '#585b70' }}>
          {sub}
        </p>
      )}
    </div>
  );
}