import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitle?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label = 'Overall Score',
  size = 'md',
  showSubtitle = true,
  subtitle,
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  // Size dimensions
  const dims = {
    sm: { size: 76, stroke: 6, text: 'text-lg', labelText: 'text-xs' },
    md: { size: 110, stroke: 8, text: 'text-2xl', labelText: 'text-xs' },
    lg: { size: 140, stroke: 10, text: 'text-3xl', labelText: 'text-sm' },
    xl: { size: 180, stroke: 12, text: 'text-4xl', labelText: 'text-sm' },
  }[size];

  const radius = (dims.size - dims.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  // Color selection
  let strokeColor = '#3b82f6'; // blue-500
  let textColor = 'text-blue-600';
  let badgeText = 'Good';

  if (clamped >= 85) {
    strokeColor = '#10b981'; // emerald-500
    textColor = 'text-emerald-600';
    badgeText = 'Excellent';
  } else if (clamped >= 70) {
    strokeColor = '#4f46e5'; // indigo-600
    textColor = 'text-indigo-600';
    badgeText = 'Strong';
  } else if (clamped >= 50) {
    strokeColor = '#f59e0b'; // amber-500
    textColor = 'text-amber-600';
    badgeText = 'Needs Work';
  } else {
    strokeColor = '#ef4444'; // red-500
    textColor = 'text-rose-600';
    badgeText = 'Critical Gaps';
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: dims.size, height: dims.size }}>
        <svg
          className="transform -rotate-90"
          width={dims.size}
          height={dims.size}
        >
          {/* Background circle */}
          <circle
            cx={dims.size / 2}
            cy={dims.size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={dims.stroke}
            fill="transparent"
          />
          {/* Animated score stroke */}
          <circle
            cx={dims.size / 2}
            cy={dims.size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dims.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold tabular-nums tracking-tight ${dims.text} ${textColor}`}>
            {clamped}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 -mt-1 tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <span className={`mt-2 font-semibold text-slate-800 ${dims.labelText}`}>
          {label}
        </span>
      )}

      {showSubtitle && (
        <span className="text-xs text-slate-500 mt-0.5">
          {subtitle || badgeText}
        </span>
      )}
    </div>
  );
};
